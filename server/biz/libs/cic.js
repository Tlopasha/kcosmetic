const _ = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const tough = require('tough-cookie');
const chalk = require('chalk');

const { getCaptchaFromUrl } = require('./deathcaptcha');
const logger = require('../../core/logger');

const Cookie = tough.Cookie;
const CIC_ORG_SEARCH_CUSTOMER = 'https://cic.org.vn/ACBBox-CIC-External/faces/TaskFlow?_afrWindowMode=0&FID=18628&_afrLoop=14903419771182813&_adf.ctrl-state=f9fw4n4kt_4';
const CIC_CHECK_INFO = 'https://cic.org.vn/ACBBox-CIC-External/faces/TaskFlow?FID=16181&_afrLoop=14914926150270902';
const HOST = 'cic.org.vn';
const ENDPOINT = 'https://cic.org.vn';
const CAPTCHA_URL = `${ENDPOINT}/ACBBox-CIC-External/captchaservlet`;


const createCookies = (cookies) => {
  return cookies.map(c => {
    const [key, value] = c.split('=');
    return new Cookie({
      key,
      value,
      domain: HOST,
      httpOnly: true,
      maxAge: 31536000
    });
  })
}

const divider = (emptyLine) => {
  if (emptyLine) {
    logger.info();
  }
  logger.info(chalk.blue.bold('---------------------------------------------------------------------'));
};

const retrieveState = (html) => {
  logger.info('Reading viewState info...');
  const $ = cheerio.load(html);
  const viewState = $('input[name="javax.faces.ViewState"]').val();
  if (viewState) {
    logger.info(chalk.green('Retrieved viewState'));
  }
  const ctrlState = $('form[name="f1"]').attr('action');
  return { viewState, ctrlState };
};

const parseCICCode = (html) => {
  divider();
  logger.info('Retrieving CIC Code');
  const $ = cheerio.load(html);
  const cicCols = $('div[id="pt1:r1:0:pc1:tblTimKiemKH::db"] table tbody tr[_afrrk="0"] td');
  if (cicCols.length <= 0) {
    logger.warn('Could not found CIC code');
    return null;
  }
  const cicCode = cicCols.eq(1).text();
  logger.info(cicCode);
  divider();
  return cicCode;
};

const parseCustomerInfo = (html) => {
  divider();
  logger.info('parseCustomerInfo');
  const $ = cheerio.load(html, { decodeEntities: false });
  logger.info($('html').html());
  const rows = $('div[id="pt1:r1:0:panel_timkiemkh"] table table tbody tr');
  logger.info(rows.length);
  divider();
  let startIdx = 8;
  return {
    customerName: rows.eq(startIdx++).text(),
    cicCode: rows.eq(startIdx++).text(),
    address: rows.eq(startIdx++).text(),
    info: rows.eq(startIdx++).text(),
  }
};

const getCICCode = async(cmt) => {
  const { body, headers } = await rp({
    url: CIC_ORG_SEARCH_CUSTOMER,
    method: 'GET',
    resolveWithFullResponse: true
  });
  const cookies = createCookies(headers['set-cookie'].map(c => c.split(';')[0]));
  const jar = rp.jar();
  _.forEach(c => {
    jar.setCookie(c, ENDPOINT);
  });
  logger.info();
  logger.info(chalk.blue.bold('---------------------[ Retreived cookies ]---------------------------'));
  logger.debug(cookies);
  logger.info(chalk.blue.bold('---------------------------------------------------------------------'));

  logger.info(chalk.blue('getCICCode...'));
  const { viewState, ctrlState } = retrieveState(body);
  logger.info(`>>>>> ${ctrlState}`);

  // logger.info(body);

  const options = {
    method: 'POST',
    // resolveWithFullResponse: true,
    uri: `${ENDPOINT}${ctrlState}`,
    form: {
      'pt1:r1:0:soc10': 0,
      'pt1:r1:0:strLoaiKH': 1,
      'pt1:r1:0:txtsocmt': cmt,
      'pt1:r1:0:pc1:j_id18': 20,
      'org.apache.myfaces.trinidad.faces.FORM': 'f1',
      'javax.faces.ViewState': viewState,
      'oracle.adf.view.rich.RENDER': 'pt1:r1',
      'oracle.adf.view.rich.DELTAS': '{pt1:r1:0:pc1:tblTimKiemKH={viewportSize=7,rows=7},pt1:r1:0:pc1:_frzMn={disabled=true},pt1:r1:0:pc1:_ufzMn={visible=false},pt1:r1:0:pc1:_frzTbr={disabled=true},pt1:r1:0:pc1:_wrpMn={disabled=true},pt1:r1:0:pc1:_wrpTbr={disabled=true},pt1:r1:0:pc1:_rszClm={disabled=true},pt1:r1:0:pc1:j_id6={disabled=true},pt1:r1:0:pc1:_clmFrzT={_unconvertedValue=},pt1:r1:0:pc1:_clmFrzC={_unconvertedValue=},pt1:r1:0:pc1:_clmHdnT={_unconvertedValue=},pt1:r1:0:pc1:_clmHdnC={_unconvertedValue=}}',
      'event': 'pt1:r1:0:btntimkiemkh',
      'event.pt1:r1:0:btntimkiemkh': '<m xmlns="http://oracle.com/richClient/comm"><k v="type"><s>action</s></k></m>',
      'oracle.adf.view.rich.PROCESS': 'pt1:r1'
    },
    jar,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    }
  };

  // divider();
  // logger.debug(options);
  // divider();

  const cicContent = await rp(options);
  // logger.info(cicContent);
  return {
    cicCode: parseCICCode(cicContent),
    ctrlState
  };
}

const getPageView = async(preCtrlState) => {
  const segments = preCtrlState.split('?');
  const stateCode = segments[segments.length - 1];
  logger.info('getPageView > stateCode > ', stateCode);
  const { body, headers } = await rp({
    url: preCtrlState ? `${CIC_CHECK_INFO}` : `${CIC_CHECK_INFO}&${preCtrlState}`,
    method: 'GET',
    resolveWithFullResponse: true
  });
  const cookies = createCookies(headers['set-cookie'].map(c => c.split(';')[0]));
  const jar = rp.jar();
  _.forEach(c => {
    jar.setCookie(c, ENDPOINT);
  });

  return {
    ...retrieveState(body),
    jar
  };
}

const postChangeCICCode = async(cicCode, preCtrlState) => {
  const { viewState, ctrlState, jar } = await getPageView(preCtrlState);
  const options = {
    method: 'POST',
    // resolveWithFullResponse: true,
    uri: `${ENDPOINT}${ctrlState}`,
    form: {
      'pt1:r1:0:txtmacic': cicCode,
      'org.apache.myfaces.trinidad.faces.FORM': 'f1',
      'javax.faces.ViewState': viewState,
      'event': 'pt1:r1:0:txtmacic',
      'event.pt1:r1:0:txtmacic': '<m xmlns="http://oracle.com/richClient/comm"><k v="autoSubmit"><b>1</b></k><k v="suppressMessageShow"><s>true</s></k><k v="type"><s>valueChange</s></k></m>',
      'oracle.adf.view.rich.PROCESS': 'pt1:r1:0:txtmacic'
    },
    jar,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  };

  logger.info(chalk.blue('postChangeCICCode...'));
  const content = await rp(options);
  return {
    ...retrieveState(content),
    jar
  };
}

const postInputCaptcha = async({ cicCode, captcha, ctrlState, viewState, jar }) => {
  const options = {
    method: 'POST',
    resolveWithFullResponse: true,
    uri: `${ENDPOINT}${ctrlState}`,
    form: {
      'pt1:r1:0:txtmacic': cicCode,
      'pt1:r1:0:it3': captcha,
      'org.apache.myfaces.trinidad.faces.FORM': 'f1',
      'javax.faces.ViewState': viewState,
      'event': 'pt1:r1:0:it3',
      'event.pt1:r1:0:it3': '<m xmlns="http://oracle.com/richClient/comm"><k v="autoSubmit"><b>1</b></k><k v="suppressMessageShow"><s>true</s></k><k v="type"><s>valueChange</s></k></m>',
      'oracle.adf.view.rich.PROCESS': 'pt1:r1:0:it3'
    },
    jar,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    }
  };

  logger.info(chalk.blue('postInputCaptcha...'));
  const content = await rp(options);
  return {
    ...retrieveState(content.body),
    cicCode,
    captcha,
    jar
  };
}

const confirmViewReport = async({ cicCode, captcha, ctrlState, viewState, jar }) => {
  const options = {
    method: 'POST',
    resolveWithFullResponse: true,
    uri: `${ENDPOINT}${ctrlState}`,
    form: {
      'pt1:r1:0:txtmacic': cicCode,
      'pt1:r1:0:it3': captcha,
      'org.apache.myfaces.trinidad.faces.FORM': 'f1',
      'javax.faces.ViewState': viewState,
      'event': 'pt1:r1:0:tnYes',
      'oracle.adf.view.rich.RENDER': 'pt1:r1',
      'oracle.adf.view.rich.DELTAS': '{pt1:r1:0:confirmXemBaoCao={_shown=pt1:r1:0:confirmXemBaoCao}}',
      'event.pt1:r1:0:tnYes': '<m xmlns="http://oracle.com/richClient/comm"><k v="type"><s>action</s></k></m>',
      'oracle.adf.view.rich.PROCESS': 'pt1:r1:0:confirmXemBaoCao'
    },
    jar,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    }
  };

  logger.info(chalk.blue('confirmViewReport...'));
  const content = await rp(options);
  return {
    ...retrieveState(content.body),
    cicCode,
    captcha,
    jar
  };
}

exports.cicGetInfoByCmt = async(cmt) => {
  const resp = await getCICCode(cmt);
  const { cicCode } = resp;
  // const { viewState, ctrlState, jar } = await postChangeCICCode(cicCode);
  const cicCodeChangeRes = await postChangeCICCode(cicCode, resp.ctrlState);

  const { text } = await getCaptchaFromUrl(CAPTCHA_URL, cicCodeChangeRes.jar);
  logger.debug(chalk.green.bold('captcha > ', text));

  const captchaChangeRes = await postInputCaptcha({ cicCode, captcha: text, ...cicCodeChangeRes });
  const { viewState, ctrlState, jar, captcha } = await confirmViewReport(captchaChangeRes);

  const options = {
    method: 'POST',
    resolveWithFullResponse: true,
    uri: `${ENDPOINT}${ctrlState}`,
    form: {
      'pt1:r1:0:txtmacic': cicCode,
      'pt1:r1:0:it3': captcha,
      'org.apache.myfaces.trinidad.faces.FORM': 'f1',
      'javax.faces.ViewState': viewState,
      'oracle.adf.view.rich.RENDER': 'pt1:r1',
      'oracle.adf.view.rich.DELTAS': '{pt1:r1:0:confirmXemBaoCao={_shown=pt1:r1:0:confirmXemBaoCao}}',
      'event': 'pt1:r1:0:tnYes',
      'event.pt1:r1:0:tnYes': '<m+xmlns="http://oracle.com/richClient/comm"><k+v="type"><s>action</s></k></m>',
      'oracle.adf.view.rich.PROCESS': 'pt1:r1:0:confirmXemBaoCao'
    },
    jar,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    }
  };

  divider();
  logger.debug(options);
  divider();

  logger.info(chalk.blue('Reading information...'));
  const content = await rp(options);
  // logger.info(content.body);
  const result = parseCustomerInfo(content.body);
  logger.debug(result);
  return result;
}

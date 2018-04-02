const queryString = require('querystring');
const http = require('http');
const fs = require('fs');
const path = require('path');
const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');

const { exec } = require('child_process');

const CAPTCHA_API = 'http://api.dbcapi.me/api/captcha';
const U = 'lucduong';
const P = 'Death!@08';

const getCaptchaImg = (html) => {
  const $ = cheerio.load(html);
  return $('img[src^="/tcnnt/captcha.png"]').attr('src');
};

const download = (uri, filename, jar, callback) => {
  request(uri, { jar }).pipe(fs.createWriteStream(filename)).on('close', callback);
};

const deCaptcha = (imageFile) => {
  const time = process.hrtime();
  const cmd = `curl -X POST -F 'captchafile=@${imageFile}' -F 'username=${U}' -F 'password=${P}' ${CAPTCHA_API}`;
  console.log('Executing: ', cmd);
  return new Promise((resolve, reject) => {
    exec(
      cmd,
      (error, stdout, stderr) => {
        const diff = process.hrtime(time);
        if (error) {
          return reject(error);
        } else {
          const result = queryString.parse(stdout || '');
          return resolve({
            result,
            time: diff[0],
            captchaFile: imageFile
          });
        }
      })
  });
};

const downloadCaptcha = (url, jar) => {
  const dir = path.resolve('tmp');
  const fileNm = `${dir}/${Date.now()}.png`;
  console.log(`Downloading ${url} > ${fileNm}`);
  return new Promise((resolve, reject) => download(url, fileNm, jar, () => resolve(fileNm)));
};

const getCaptcha = async(captchaId, repeat = 500) => {
  const result = await rp.get(`${CAPTCHA_API}/${captchaId}`).then(response => queryString.parse(response || ''));
  const { text } = result;
  if (text !== '' || repeat <= 0)
    return result;
  else return getCaptcha(captchaId, repeat - 1);
};

const getCaptchaFromUrl = async(captchaUrl, jar) => {
  const captchaFile = await downloadCaptcha(captchaUrl, jar);
  console.log('Start deCaptcha > ', captchaFile);
  const { result, time } = await deCaptcha(captchaFile);
  const { captcha, text, is_correct } = result;
  return getCaptcha(captcha);
};

module.exports = {
  getCaptchaImg,
  downloadCaptcha,
  deCaptcha,
  getCaptcha,
  getCaptchaFromUrl,
};

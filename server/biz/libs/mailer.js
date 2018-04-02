const _ = require('lodash');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const Mailer = require('email-templates');
const path = require('path');
const logger = require('../../core/logger');


const { SMTP } = require('./constants');
// //const Configs = require('../modules/settings/models/Config');
const AppConfig = require('../../config');
const serverFolder = path.normalize(path.join(AppConfig.rootPath, 'server'));

//trong nay moi get config mà phai hong ?
const configs = async() => {
  // const configNames = [SMTP.SMTP_HOST, SMTP.SMTP_PORT, SMTP.SMTP_USER, SMTP.SMTP_PASS, SMTP.SMTP_SECURE]
  // let _configs = await Configs.find({ name: { $in: configNames } })
  // let cMap = _.reduce(_configs, (map, itm) => {
  //   return {
  //     ...map,
  //     [itm.name]: itm.value
  //   }
  // }, {})
// cai nay ben ihello la get trong DB len. còn bên e thì nó set luôn k có cofing. 
  return {
    from: 'noreply@credit-score.com',
    host: 'smtp.mailtrap.io',//cMap[SMTP.SMTP_HOST] || process.env.SMTP_HOST,
    port: 2525, //parseInt(cMap[SMTP.SMTP_PORT]) || process.env.SMTP_PORT,
    secure: false,//cMap[SMTP.SMTP_SECURE] === 'true', // TLS
    auth: {
      user: 'b68b807200d1db',//cMap[SMTP.SMTP_USER] || process.env.SMTP_USER,
      pass: '193177dee60278',//cMap[SMTP.SMTP_PASS] || process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  }
}

const transporter = async(_configs) => {
  _configs = _configs || await configs()
  return nodemailer.createTransport(smtpTransport(_configs))
}

/**
 * Send email function using SMTP
 * 
 * @param {string} to 
 * @param {string} subject 
 * @param {string} html 
 * @param {string} text 
 * @return {Promise}
 */
const send = async({ to, subject, html, attachments }) => {
  const c = await configs();
  logger.info(`Sending mail from ${c.auth.user} to ${to} .....`)
  
  let mail = {
    from: c.from,
    to: to,
    subject: subject,
    attachments: attachments
  };
  if (html) {
    mail.html = html;
  }
  const t = await transporter(c);
  return t.sendMail(mail)
    .then(response => {
      t.close();
      logger.info(`Sent mail to ${to} .....`)
      return response;
    })
}

const sendHTML = async({ to, template, data }) => {
  const c = await configs();
  const transport = await transporter(c);
  const email = new Mailer({
    message: { from: c.from },
    views: { root: `${serverFolder}/emails` },
    transport
  });

  return email.send({
    template,
    message: { to },
    locals: data,
  });
}


module.exports = {
  send,
  sendHTML,
}

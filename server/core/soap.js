'use strict';

const soap = require('soap');
const url = 'http://103.48.194.60/WebserivceFibo/MtReceiver.asmx?wsdl';

const replyToUser = (args) => {
  return soap.createClientAsync(url)
    .then(client => {
      const { RequestId } = args;
      const params = {
        ...args,
        MoId: RequestId,
        MsgContentTypeId: 1,
        FeeTypeId: 1
      };
      console.log('Send a sms with params >>> ', params);
      return client.ReceiveMtReplyMoAsync(params);
    });
};

exports.init = (app, serivces) => {
  const smsService = serivces.get('sms');
  app.get('/Webservice/ReceiveMtReplyMo', async (req, res, next) => {
    console.log('>>> Receive query >>> ', req.query);
    const { Username, Password, Phonenumber, PrefixId, MsgContent, RequestId } = req.query;
    if (!Username || !Password || !Phonenumber || !RequestId || !PrefixId || !MsgContent) {
      return res.send('-1');
    }

    const [CommandCode, cmnd] = MsgContent.split(' ');
    console.log('>>> creditKey >>> ', CommandCode, ' >>> cmnd >>> ', cmnd);
    if (`${CommandCode}`.toLowerCase() !== 'credit') return res.send('-1');
    const { code } = await smsService.insertVerifyCode({ cmnd, phone: Phonenumber });

    let newMsgContent = `Ma xac nhan cua ban la '${code}'. Vui long nhap so CMND '${cmnd}' va ma '${code}' de cham diem tin dung.`;
    try {
      const sendRes = await replyToUser({
        Username, Password, PhoneNumber: Phonenumber, PrefixId, CommandCode, RequestId,
        MsgContent: newMsgContent
      });

      console.log('>>> response from sms sending >>> ', sendRes);
      const { ReceiveMtReplyMoResult } = sendRes;
      res.send(ReceiveMtReplyMoResult);
    } catch (err) {
      console.error('Error from soap client >>> ', err);
      res.send('-1');
    }
  });
}


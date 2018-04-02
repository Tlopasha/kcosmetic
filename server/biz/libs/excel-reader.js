const xlsx = require('node-xlsx').default
const path = require('path')
const fs = require('fs')
const moment = require('moment')
const mongoose = require('mongoose')
const _ = require('lodash')
const { checkValidPhoneNumber,changePhoneNumberTo84 } = require('./common')

const insertDataToCollection = (data, collection) => {
  // if (!data || data.length === 0)
  //   return Promise.resolve();

  // data.forEach(d => {
  //   collection.findOneAndUpdate({ phoneNo: d.phoneNo, groupId: d.groupId, customerId: d.customerId }, { $set: d }, { upsert: true })
  // })

  // return Promise.resolve();

    if (!data || data.length === 0)
      return Promise.resolve()

    let bulk = collection.initializeUnorderedBulkOp({ useLegacyOps: true })
    data.forEach(d => {
      if (d.importType == 1 || d.importType == 2) {
        if (d.importType == 1) {
          delete d.importType
          bulk.find({ name: d.name }).upsert().replaceOne(d)
        } else {
          delete d.importType
          bulk.find({ name: d.name }).upsert().updateOne({ $set: d })
        }
      } else {
        delete d.importType
        bulk.find({ name: d.name }).upsert().updateOne({ $setOnInsert: d })
      }
    })

  return bulk.execute()
    .then(r => {
      return {
        inserted: r.nUpserted || 0,
        updated: r.nModified || 0,
        matched: r.nMatched || 0,
      }
    })
}

class ExcelReader {
  constructor(excelFile) {
    this.path = excelFile
    this.worksheet = null
  }

  read() {
    console.log(`Importing ${this.path}...`)
    console.time('ExcelReader > read')
    this.worksheet = xlsx.parse(fs.readFileSync(this.path))
    console.timeEnd('ExcelReader > read')
    return this
  }

  toDB(db, isWriteOver) {
    console.log('excelToDb...');
    let data = [];
    let promises = [];
    const sheet = this.worksheet[0];
    let rows = sheet.data
    rows.shift();
    rows.forEach(r => {
      if (r.length === 0 || !r[0])
        return

      const d = {
        importType: isWriteOver,
        name: r[0],
        adress: r[1],
        law: r[2],
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
      }

      data.push(d);

    })

    console.log('data >>>' , data)
 
    const c = db.collection('dbdn')
    promises.push(insertDataToCollection(data, c))
  
    console.time('excelToDb > ')
    return Promise.all(promises).then(r => {
        console.log(r)
        console.timeEnd('excelToDb > ')
        return r
      })
  }

  //Using to read file contact sample
  getFlexibleExcle() {
    console.log('excelToGetData...');
    const data = [];
    const lstHeader = [];
    const sheet = this.worksheet[0];
    const rows = sheet.data;
    if (!rows || rows.length === 0) return {};
    const headers = rows[0];
    const rowCount = rows.length;
    for (let i = 1; i < rowCount; i++) {
      const r = rows[i];
      const colCount = headers.length;
      let obj = {};
      for (let j = 0; j < colCount; j++) {
        obj[headers[j]] = r[j];
      }
      data.push(obj);
    }

    return {
      data,
      headers
    };
  }
}

module.exports = ExcelReader

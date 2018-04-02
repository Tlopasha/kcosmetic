const fs = require('fs');
const mkdirp = require('mkdirp');
const _ = require('lodash');
const moment = require('moment');
const path = require('path');
const EXPORT_DIR = 'export/'//path.resolve(global.rootPath, 'export');
const xlsx = require('node-xlsx').default;

const mkdirSync = (path) => {
  try {
    if (!fs.existsSync(path)) {
      return mkdirp.sync(path);
    }
  } catch (e) {
    if (e.code != 'EEXIST') throw e;
  }
}

const newArray = (len) => {
  const res = [];
  for (let i = 0; i < len; i++) {
    res.push('');
  }
  return res;
}

/**
 * write data to excel file.
 */
const writeExcel = async (headers, rows, filename) => {
  console.log(`export dir: ${EXPORT_DIR}`);
  const today = moment().format('DD-MM-YYYY');
  mkdirSync(EXPORT_DIR);
  mkdirSync(path.resolve(EXPORT_DIR, today));

  const fields = headers.map(h => {
    return h.field;
  })
  const titles = headers.map(h => {
    return h.title;
  })

  const data = [titles];
  _.forEach(rows, r => {
    let row = newArray(titles.length);
    Object.keys(r).forEach(k => {
      let v = r[k];
      let idx = fields.indexOf(k);
      if (idx !== -1) {
        row[idx] = v;
      }
    });
    data.push(row);
  })
  const exportName = `${today}-${filename.split('.')[0]}`

  return new Promise((resolve, reject) => {
    const buffer = xlsx.build([{ name: 'sheet1', data: data }])
    fs.writeFile(`${EXPORT_DIR}/${today}/${today}-${filename}`, buffer, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }).then((data) => {
    return {
      filename: `${today}-${filename}`,
      data: data,
      parent: today,
    }
  })
}

module.exports = {
  mkdirSync,
  writeExcel,
}

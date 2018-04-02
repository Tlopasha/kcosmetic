/**
 * Ma so thue helper
 */
const cheerio = require('cheerio');

const KEYS = ['stt', 'mst', 'nguoi_nop_thue', 'co_quan_thue', 'cmt', 'ngay_cap_nhat', 'ghi_chu'];

String.prototype.deepTrim = function() {
  const text = this;
  return text ? text.trim().replace(/^[\r\n\t]+/, '').replace(/[\r\n\t]+$/) : '';
};

const parseRow = (row) => {
  const data = {};
  const tds = row.find('td');
  tds.each((idx, cell) => {
    data[KEYS[idx]] = tds.eq(idx).text().trim();
  })
  return data;
};

/**
 * 
 * 
 * @param {*} html 
 * @return
 * { 
 *   headers:
 *   {
 *     stt: 'STT',
 *     mst: 'MST',
 *     nguoi_nop_thue: 'Tên người nộp thuế',
 *     co_quan_thue: 'Cơ quan thuế',
 *     cmt: 'Số CMT/Thẻ căn cước',
 *     ngay_cap_nhat: 'Ngày thay đổi thông tin gần nhất',
 *     ghi_chu: 'Ghi chú'
 *    },
 *    data:[
 *      {
 *         stt: '1',
 *         mst: '0314137855',
 *         nguoi_nop_thue: 'CÔNG TY TNHH PHẦN',
 *         co_quan_thue: 'Chi cục Thuế Quận Tân Bình',
 *         cmt: '142523667',
 *         ngay_cap_nhat: '19/01/2017',
 *         ghi_chu: 'NNT đang hoạt động (đã được cấp GCN ĐKT)'
 *      },
 *      ...
 *    ]
 * }
 */
exports.parseResultTable = (html) => {
  const $ = cheerio.load(html, { decodeEntities: false });
  const selector = '.ta_border tbody';
  const tbl = $(selector);
  const rows = tbl.find('tr');
  const rowCount = rows.length;
  const tblHeaders = tbl.find('tr').first().find('th');
  const headers = {};
  tblHeaders.each((idx, h) => {
    headers[KEYS[idx]] = tblHeaders.eq(idx).text();
  })
  const data = [];
  for (let i = 1; i < rowCount - 1; i++) {
    const row = parseRow(rows.eq(i));
    data.push(row);
  }
  return { headers, data };
};

const trim = (text) => {
  return text ? text.trim().replace(/[\r\n\t]/g, '') : '';
};

/**
 * 
 * @param {Cheerio} row 
 * @param {*} keys
 */
const parseDetailRow = (row, keys) => {
  const rowTds = row.find('td');
  const rowThs = row.find('th');
  const data = {};
  const keyLen = keys.length;
  let index = 0;
  keys.forEach(key => {
    const value = rowTds.eq(index).text().deepTrim();
    const header = rowThs.eq(index).text().deepTrim();
    data[key] = { key, value, header };
    index++;
  });
  return data;
};

/**
 * 
 * @param {*} html 
 * @return 
 * {
 *   mstdn: { 
 *     key: 'mstdn',
 *     value: '0314137855',
 *     header: 'Mã số doanh nghiệp'
 *   },
 *   ...
 * }
 */
exports.parseDetailData = (html) => {
  const $ = cheerio.load(html, { decodeEntities: false });
  const selector = '.ta_border tbody tr';
  const rows = $(selector);

  let idx = 0;
  const data = {
    ...parseDetailRow(rows.eq(idx++), ['mstdn', 'ngay_cap', 'ngay_dong_mst']),
    ...parseDetailRow(rows.eq(idx++), ['ten_chinh_thuc', 'ten_giao_dich']),
    ...parseDetailRow(rows.eq(idx++), ['noi_dang_ky_quan_ly_thue']),
    ...parseDetailRow(rows.eq(idx++), ['dia_chi_tru_so']),
    ...parseDetailRow(rows.eq(idx++), ['noi_dang_ky_nop_thue']),
    ...parseDetailRow(rows.eq(idx++), ['dia_chi_nhan_thong_bao_thue']),
    ...parseDetailRow(rows.eq(idx++), ['qdtl_ngay_cap', 'co_quan_ra_quyet_dinh']),
    ...parseDetailRow(rows.eq(idx++), ['gpkd_ngay_cap', 'co_quan_cap', 'ngay_nhan_to_khai']),
    ...parseDetailRow(rows.eq(idx++), ['ngay_bd_nam_tc', 'ngay_kt_nam_tc', 'ms_hien_thoi']),
    ...parseDetailRow(rows.eq(idx++), ['ngay_bd_hd']),
    ...parseDetailRow(rows.eq(idx++), ['chuong_khoan', 'hinh_thuc_thanh_toan', 'pp_tinh_thue_gtgt']),
    ...parseDetailRow(rows.eq(idx++), ['chu_so_huu', 'dc_chu_so_huu']),
    ...parseDetailRow(rows.eq(idx++), ['ten_giam_doc', 'dc_giam_doc']),
    ...parseDetailRow(rows.eq(idx++), ['ke_toan_truong', 'dc_ke_toan_truong']),
  };
  return data;
};

exports.parseDetailPerson = (html) => {
  const $ = cheerio.load(html, { decodeEntities: false });
  const selector = '.ta_border tbody tr';
  const rows = $(selector);

  let idx = 0;
  const data = {
    ...parseDetailRow(rows.eq(idx++), ['mst']),
    ...parseDetailRow(rows.eq(idx++), ['ten_nguoi_nop_thue']),
    ...parseDetailRow(rows.eq(idx++), ['so_cmt']),
    ...parseDetailRow(rows.eq(idx++), ['noi_dang_ky_quan_ly']),
    ...parseDetailRow(rows.eq(idx++), ['tc_tru_so']),
    ...parseDetailRow(rows.eq(idx++), ['tinh_tp']),
    ...parseDetailRow(rows.eq(idx++), ['quan_huyen']),
    ...parseDetailRow(rows.eq(idx++), ['dien_thoai']),
    ...parseDetailRow(rows.eq(idx++), ['ngay_cap_mst']),
    ...parseDetailRow(rows.eq(idx++), ['ngay_dong_mst']),
    ...parseDetailRow(rows.eq(idx++), ['ghi_chu']),
  };
  return data; 
}

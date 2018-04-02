const HOST = 'tracuunnt.gdt.gov.vn';
const ENDPOINT = `http://${HOST}`;
const URI_MSTDN = `${ENDPOINT}/tcnnt/mstdn.jsp`;
const URI_MSTCN = `${ENDPOINT}/tcnnt/mstcn.jsp`;

const LAST_CHECK_DAY = 'LAST_CHECK_DAY';
const MAX_TIMES_SEARCH = 'MAX_TIMES_SEARCH';

module.exports = {
  HOST,
  ENDPOINT,
  URI_MSTDN,
  URI_MSTCN,
  LAST_CHECK_DAY,
  MAX_TIMES_SEARCH,
};

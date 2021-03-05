import * as datetime from 'https://deno.land/std/datetime/mod.ts';

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const abbrDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const abbrMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const formatDate = (date) => ({
  // YYYY-MM-DDTHH:mm:ss.sssZ
  ISO: date.toISOString(),
  // ddd, DD MMM YYYY HH:mm:ss ZZ
  RSS: datetime.toIMF(date),
  // Sunday ... Saturday
  dddd: days[date.getDay()],
  // Sun ... Sat
  ddd: abbrDays[date.getDay()],
  // 01 ... 31
  DD: `${date.getDate()}`.padStart(2, '0'),
  // 1 ... 31
  D: date.getDate(),
  // January ... December
  MMMM: months[date.getMonth()],
  // Jan ... Dec
  MMM: abbrMonths[date.getMonth()],
  // 01 ... 12
  MM: `${date.getMonth() + 1}`.padStart(2, '0'),
  // 1 ... 12
  M: date.getMonth() + 1,
  // 2021
  YYYY: date.getFullYear()
});

// https://raw.githubusercontent.com/markedjs/marked/master/src/helpers.js
const escapeTest = /[&<>"']/;
const escapeReplace = /[&<>"']/g;
const escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
const escapeReplacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

const getEscapeReplacement = (ch) => escapeReplacements[ch];

const escapeHTML = (html, encode) => {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  } else {
    if (escapeTestNoEncode.test(html)) {
      return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }
  return html;
};

export {formatDate, escapeHTML};

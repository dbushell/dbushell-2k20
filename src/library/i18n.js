// Date formatting

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

// Return string date formats based on Moment.js
// https://momentjs.com/docs/#/displaying/format/
const formatDate = (now = new Date()) => {
  const date = {
    // YYYY-MM-DDTHH:mm:ss.sssZ
    ISO: now.toISOString(),
    // Sunday ... Saturday
    dddd: days[now.getDay()],
    // Sun ... Sat
    ddd: abbrDays[now.getDay()],
    // 01 ... 31
    DD: `${now.getDate()}`.padStart(2, '0'),
    // 1 ... 31
    D: now.getDate(),
    // January ... December
    MMMM: months[now.getMonth()],
    // Jan ... Dec
    MMM: abbrMonths[now.getMonth()],
    // 01 ... 12
    MM: `${now.getMonth() + 1}`.padStart(2, '0'),
    // 1 ... 12
    M: now.getMonth() + 1,
    // 2021
    YYYY: now.getFullYear()
  };
  // ddd, DD MMM YYYY HH:mm:ss ZZ
  // Mon, 01 Mar 2021 10:00:00 +0000
  date.RSS = `${date.ddd}, ${date.DD} ${date.MMM} ${date.YYYY}`;
  date.RSS += ' 10:00:00 +0000';
  return date;
};

export {formatDate};

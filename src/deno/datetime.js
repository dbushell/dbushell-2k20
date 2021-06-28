import * as datetime from 'datetime';

const dateProps = (date = new Date()) => ({
  // YYYY-MM-DDTHH:mm:ss.sssZ
  ISO: date.toISOString(),
  // ddd, DD MMM YYYY HH:mm:ss ZZ
  IMF: datetime.toIMF(date),
  // Sunday ... Saturday
  dddd: date.toLocaleString('en-GB', { weekday: 'long' }),
  // Sun ... Sat
  ddd: date.toLocaleString('en-GB', { weekday: 'short' }),
  // 01 ... 31
  DD: `${date.getDate()}`.padStart(2, '0'),
  // 1 ... 31
  D: date.getDate(),
  // January ... December
  MMMM: date.toLocaleString('en-GB', { month: 'long' }),
  // Jan ... Dec
  MMM: date.toLocaleString('en-GB', { month: 'short' }),
  // 01 ... 12
  MM: `${date.getMonth() + 1}`.padStart(2, '0'),
  // 1 ... 12
  M: date.getMonth() + 1,
  // 2021
  YYYY: date.getFullYear()
});

export {dateProps};

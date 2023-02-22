export const convertToDispDate = (date) => {
  console.log('date: ', date);
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Tokyo',
  });
  const formattedDate = formatter.format(date);

  return formattedDate;
};

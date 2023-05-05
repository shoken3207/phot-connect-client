export const convertToSaveDate = (date) => {
  const formatDate = date.toISOString();
  return formatDate;
};

export const convertToDefaultDeadLine = (date) => {
  const deadLine = new Date(
    `${date.getFullYear()}/${date.getMonth() + 1}/${
      date.getDate() - 1
    } 23:59:59`
  );
  return deadLine;
};

export const getYear = (saveDate) => {
  const date = new Date(saveDate);
  return date.getFullYear();
};
export const getMonth = (saveDate) => {
  const date = new Date(saveDate);
  return date.getMonth() + 1;
};
export const getDate = (saveDate) => {
  const date = new Date(saveDate);
  return date.getDate();
};
export const getDay = (saveDate) => {
  const weeks = ['日', '月', '火', '水', '木', '金', '土'];
  const date = new Date(saveDate);
  const week = date.getDay();
  return weeks[week];
};

export const gethours = (saveDate) => {
  const date = new Date(saveDate);
  return date.getHours();
};
export const getMinutes = (saveDate) => {
  const date = new Date(saveDate);
  return date.getMinutes();
};
export const getSeconds = (saveDate) => {
  const date = new Date(saveDate);
  return date.getSeconds();
};

export const getPlanDate = (saveDate) => {
  const date = new Date(saveDate);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

export const getChatDate = (saveDate) => {
  const date = new Date(saveDate);
  return `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
};

export const getSendMessageCompereDate = (saveDate) => {
  const date = new Date(saveDate);
  return `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}`;
};

export const getChatCompereDate = (saveDate) => {
  const date = new Date(saveDate);
  return `${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
};

export const getChatDispDate = (saveDate) => {
  const date = new Date(saveDate);
  return `${date.getMonth() + 1}月${date.getDate()}日(${getDay(saveDate)})`;
};

const addZero = (value) => {
  const valLen = value.toString().length;
  let formatValue;
  if (valLen === 0) {
    formatValue = '00';
  } else if (valLen === 1) {
    formatValue = '0' + value;
  } else {
    formatValue = value;
  }
  return formatValue;
};

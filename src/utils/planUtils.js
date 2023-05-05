import { convertToDefaultDeadLine } from './dateUtils';

export const isClosedPlanByDeadLine = (saveDeadLine) => {
  const nowDate = new Date();
  const deadLine = new Date(saveDeadLine);
  return deadLine < nowDate;
};
export const isClosedPlanByDefaultDeadLine = (saveDate) => {
  const nowDate = new Date();
  const date = new Date(saveDate);
  const defaultDeadLine = convertToDefaultDeadLine(date);
  return defaultDeadLine < nowDate;
};

import { CLOSED_PLAN_IMAGE_PATH, NO_IMAGE_PATH } from '../const';
import {
  isClosedPlanByDeadLine,
  isClosedPlanByDefaultDeadLine,
} from './planUtils';

export const convertList = (list) => {
  const commonList = list.map((x) => {
    return {
      primaryText: x.username,
      secondaryText: x.desc,
      iconImage: x.icon_image,
      id: x._id,
    };
  });
  return commonList;
};

export const convertPlanImages = (plans) => {
  const convertPlans = plans.map((plan) => {
    if (plan.images.length === 0) {
      plan.images.push(NO_IMAGE_PATH);
    }
    if (
      (plan.dead_line === '' && isClosedPlanByDefaultDeadLine(plan.date)) ||
      (plan.dead_line !== '' && isClosedPlanByDeadLine(plan.dead_line)) ||
      (plan.limit > 0 && plan.limit <= plan.participants.length)
    ) {
      plan.images.unshift(CLOSED_PLAN_IMAGE_PATH);
    }

    return plan;
  });
  return convertPlans;
};

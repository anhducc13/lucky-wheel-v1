import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IStaff } from "./types";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getListAvaiableStaffsOfPrize = (
  staffs: IStaff[],
  prize: number
) => {
  switch (prize) {
    case 4:
    case 3:
      return staffs.filter((el) => !el.isWin);
    case 2:
    case 1:
      return staffs.filter((el) => !el.isPartTime && !el.isWin);
    case 0: {
      const milestone = dayjs(new Date()).subtract(1, "year");
      return staffs.filter((el) => {
        return (
          !el.isPartTime &&
          !el.isWin &&
          el.startDate &&
          dayjs(el.startDate).isSameOrBefore(milestone)
        );
      });
    }
    default:
      return [];
  }
};

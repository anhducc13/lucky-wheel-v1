export type IStaff = {
  id: string;
  code: string;
  name: string;
  email: string;
  isPartTime: boolean;
  startDate: string;
  luckyNumber: string;
  isWin?: boolean;
};

export type IStaffForm = Omit<IStaff, "id" | "luckyNumber">;

export type IPrize = {
  id: string;
  code: string;
  prize: number;
};

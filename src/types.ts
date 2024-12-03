export type IStaff = {
  id: string;
  code: string;
  name: string;
  email: string;
  isPartTime: boolean;
  startDate: string;
  luckyNumber: string;
};

export type IStaffForm = Omit<IStaff, "id" | "luckyNumber">;

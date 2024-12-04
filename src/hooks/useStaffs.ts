import { useEffect, useState } from "react";
import { IStaff } from "../types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const useStaffs = () => {
  const [loading, setLoading] = useState(false);
  const [staffs, setStaffs] = useState<IStaff[]>([]);

  const fetchStaffs = async (hasLoading = true) => {
    if (hasLoading) setLoading(true);
    try {
      await getDocs(collection(db, "staffs")).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setStaffs(newData as IStaff[]);
      });
    } catch (error) {
      console.error(error);
    } finally {
      if (hasLoading) setLoading(false);
    }
  };

  const mutateStaffs = async () => {
    fetchStaffs(false);
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  return {
    loading,
    staffs,
    mutateStaffs,
    staffsMap: staffs.reduce<Record<string, IStaff>>(
      (acc, staff) => ({ ...acc, [staff.code]: staff }),
      {}
    ),
  };
};

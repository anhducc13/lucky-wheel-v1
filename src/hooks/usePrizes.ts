import { useEffect, useState } from "react";
import { IPrize } from "../types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const usePrizes = () => {
  const [prizes, setPrizes] = useState<IPrize[]>([]);

  const fetchPrizes = async () => {
    try {
      await getDocs(collection(db, "prizes")).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPrizes(newData as IPrize[]);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  return {
    prizes,
    mutatePrizes: fetchPrizes,
  };
};

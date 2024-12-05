import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@nextui-org/react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { LuTrash } from "react-icons/lu";
import { MAPPING_PRIZE_NAME } from "../constants";
import { db } from "../firebase";
import { IPrize, IStaff } from "../types";
import { cn } from "../utils";

type Props = {
  open: boolean;
  onClose: () => void;
  prizes: IPrize[];
  mutatePrizes: () => Promise<void>;
  staffs?: IStaff[];
};

export const JackpotResult: React.FC<Props> = ({
  open,
  onClose,
  staffs = [],
  prizes,
  mutatePrizes,
}: Props) => {
  const [currentTab, setCurrentTab] = useState(4);

  useEffect(() => {
    if (open) {
      mutatePrizes();
    }
  }, [open]);

  const columns = [
    { name: "Mã nhân viên", uid: "code" },
    { name: "Số may mắn", uid: "luckyNumber" },
    { name: "Họ tên", uid: "name" },
    { name: "Email", uid: "email" },
    { name: "Actions", uid: "action" },
  ];

  const handleDeletePrize = async (prize: IPrize) => {
    const code = prize.code;
    await deleteDoc(doc(db, "prizes", prize.id));

    const staffId = staffs.find((el) => el.code === code)?.id;
    if (staffId) {
      const docRef = doc(db, "staffs", staffId);
      await updateDoc(docRef, { isWin: false });
    }

    mutatePrizes();
  };

  const renderCell = (staff: IStaff, columnKey: string) => {
    const cellValue = staff[columnKey as keyof IStaff];

    switch (columnKey) {
      case "action":
        return (
          <LuTrash
            onClick={() => {
              const isConfirm = confirm(`Gỡ giải thưởng của bạn ${staff.name}`);
              if (isConfirm) {
                const deletedPrize = prizes.find(
                  (el) => el.code === staff.code
                );
                if (deletedPrize) handleDeletePrize(deletedPrize);
              }
            }}
            className="text-red-500 cursor-pointer"
          />
        );
      default:
        return cellValue;
    }
  };

  const displayItems = useMemo(() => {
    const listPrize = prizes
      .filter((el) => el.prize === +currentTab)
      .map((el) => el.code);
    return staffs.filter((el) => listPrize.includes(el.code));
  }, [prizes, staffs, currentTab]);

  return (
    <Modal
      size="4xl"
      isOpen={open}
      onClose={onClose}
      classNames={{
        closeButton: "top-3 right-3",
      }}
    >
      <ModalContent className="shadow-[0_0_18px_3px_hsla(0,0%,100%,.69)]">
        <ModalHeader className="flex flex-col items-center gap-1 bg-[#ffd211]">
          Kết quả quay số may mắn
        </ModalHeader>
        <ModalBody className="py-4">
          <Tabs
            selectedKey={currentTab}
            onSelectionChange={(k) => setCurrentTab(k as number)}
            size="lg"
            fullWidth
            variant="underlined"
          >
            {[4, 3, 2, 1, 0].map((el) => (
              <Tab
                className="bg-transparent"
                key={el}
                title={MAPPING_PRIZE_NAME[el]}
              />
            ))}
          </Tabs>
          <Table>
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  className={cn({
                    "min-w-[200px]": column.uid === "name",
                  })}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={"Chưa có dữ liệu"} items={displayItems}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell className="text-black">
                      {renderCell(item, columnKey as string)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

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
import { LuTrash } from "react-icons/lu";
import { MAPPING_PRIZE_NAME } from "../constants";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const JackpotResult: React.FC<Props> = ({ open, onClose }: Props) => {
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
          <Tabs size="lg" fullWidth variant="underlined">
            {[4, 3, 2, 1, 0].map((el) => (
              <Tab
                className="bg-transparent"
                key={el}
                title={MAPPING_PRIZE_NAME[el]}
              />
            ))}
          </Tabs>
          <Table classNames={{ wrapper: "py-0" }} shadow="none">
            <TableHeader>
              <TableColumn align="center">#</TableColumn>
              <TableColumn align="center">Mã nhân viên</TableColumn>
              <TableColumn width={200} align="center">
                Họ và tên
              </TableColumn>
              <TableColumn width={200} align="center">
                Email
              </TableColumn>
              <TableColumn align="center">Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4].map((el, idx) => (
                <TableRow key={el}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>F12345</TableCell>
                  <TableCell>Trần Tiến Đức</TableCell>
                  <TableCell>ductran@prepedu.com</TableCell>
                  <TableCell className="flex justify-center">
                    <LuTrash className="text-red-500 cursor-pointer" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

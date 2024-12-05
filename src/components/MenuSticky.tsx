import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { signOut } from "firebase/auth";
import { LuList } from "react-icons/lu";
import { firebaseAuth } from "../firebase";
import { Link } from "react-router-dom";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  soundElement?: any;
};

export const MenuSticky: React.FC<Props> = ({ soundElement }) => {
  const handleLogout = () => {
    signOut(firebaseAuth).then(() => {
      window.location.reload();
    });
  };
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className="fixed top-4 right-4 md:right-auto md:left-4"
          radius="full"
          variant="shadow"
          isIconOnly
        >
          <LuList className="size-6" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem as={Link} href="/" key="home" {...{ to: "/" }}>
          Trang chủ
        </DropdownItem>
        <DropdownItem as={Link} href="/spin" key="new" {...{ to: "/spin" }}>
          Quay số
        </DropdownItem>
        <DropdownItem
          as={Link}
          href="/staffs"
          key="copy"
          {...{ to: "/staffs" }}
        >
          Danh sách nhân viên
        </DropdownItem>
        {soundElement && soundElement}
        <DropdownItem
          onClick={handleLogout}
          key="delete"
          className="text-danger"
          color="danger"
        >
          Đăng xuất
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

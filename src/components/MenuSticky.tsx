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

export const MenuSticky = () => {
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
        <DropdownItem as={Link} href="/" key="new" {...{ to: "/" }}>
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

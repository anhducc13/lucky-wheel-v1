/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Chip,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import * as XLSX from "xlsx";
import { MenuSticky } from "../components";
import { db } from "../firebase";
import { IStaff, IStaffForm } from "../types";
import { cn } from "../utils";

export const Staff = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [staffs, setStaffs] = useState<IStaff[]>([]);
  const [loadingGenLuckyNumber, setLoadingGenLuckyNumber] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");

  const hasSearchFilter = Boolean(filterValue);

  const fetchStaffs = async () => {
    await getDocs(collection(db, "staffs")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setStaffs(newData as IStaff[]);
    });
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const records = XLSX.utils
        .sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
          header: 1,
        })
        .slice(1)
        .filter(
          (el) =>
            (el as any)?.length > 0 && !!(el as any)?.[0] && !!(el as any)?.[1]
        );
      const newStaffs: IStaffForm[] = [];
      records.forEach((el: any) => {
        const code = el?.[1];
        const name = el?.[2];
        const email = el?.[3];
        const startDate = el?.[7];
        const work = el?.[8];
        if (code && email && startDate && work) {
          const date = dayjs(new Date("1899-12-30"));
          newStaffs.push({
            code: code.toString().trim(),
            name: name ? name.toString().trim() : "",
            email: email.toString().trim(),
            startDate: date.add(startDate, "day").format("YYYY-MM-DD"),
            isPartTime: work.toString().trim() === "Part-time",
          });
        }
      });
      const batch = writeBatch(db);

      newStaffs.forEach((el) => {
        const docRef = doc(collection(db, "staffs"));
        batch.set(docRef, el);
      });
      await batch.commit();
    }
  };

  const handleGenLuckyNumber = async () => {
    if (!staffs?.length) return;
    try {
      setLoadingGenLuckyNumber(true);
      const luckyNumbers = Array.from(
        { length: staffs.length },
        (_, i) => i + 1
      )
        .map((el) => el.toString().padStart(3, "0"))
        .sort(() => 0.5 - Math.random());

      const batch = writeBatch(db);
      staffs.forEach((el, idx) => {
        const docRef = doc(db, "staffs", el.id);
        batch.update(docRef, { luckyNumber: luckyNumbers[idx] });
      });
      await batch.commit();
    } finally {
      setLoadingGenLuckyNumber(false);
    }
  };

  const columns = [
    { name: "Mã nhân viên", uid: "code" },
    { name: "Số may mắn", uid: "luckyNumber" },
    { name: "Họ tên", uid: "name" },
    { name: "Email", uid: "email" },
    { name: "Ngày lên chính thức", uid: "startDate" },
    { name: "Hình thức làm việc", uid: "isPartTime" },
  ];

  const renderCell = useCallback((staff: IStaff, columnKey: string) => {
    const cellValue = staff[columnKey as keyof IStaff];

    switch (columnKey) {
      case "isPartTime":
        return cellValue ? (
          <Chip size="sm" color="success">
            Part-time
          </Chip>
        ) : (
          <Chip size="sm" color="primary">
            Full-time
          </Chip>
        );
      case "startDate":
        return dayjs(cellValue as string).format("DD/MM/YYYY");
      default:
        return cellValue;
    }
  }, []);

  const filteredStaffs = useMemo(() => {
    let _filteredStaffs = [...staffs];

    if (hasSearchFilter) {
      _filteredStaffs = _filteredStaffs.filter(
        (user) =>
          (user.name || "").toLowerCase().includes(filterValue.toLowerCase()) ||
          (user.email || "")
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          (user.code || "").toLowerCase().includes(filterValue.toLowerCase()) ||
          (user.luckyNumber || "")
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      );
    }

    return _filteredStaffs;
  }, [staffs, filterValue]);

  const displayStaffs = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredStaffs.slice(start, end);
  }, [page, filteredStaffs, rowsPerPage]);

  const pages = Math.ceil(filteredStaffs.length / rowsPerPage);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full text-black"
            placeholder="Tìm kiếm"
            startContent={<LuSearch className="size-6 min-w-6" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Tổng số: {staffs.length} nhân viên
          </span>
          <label className="flex items-center text-default-400 text-small">
            Số phần tử trên mỗi trang:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option selected value="10">
                10
              </option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onRowsPerPageChange,
    staffs.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" onPress={onPreviousPage}>
            Trang trước
          </Button>
          <Button isDisabled={pages === 1} size="sm" onPress={onNextPage}>
            Trang tiếp
          </Button>
        </div>
      </div>
    );
  }, [displayStaffs.length, page, pages]);

  return (
    <div
      style={{
        background:
          "linear-gradient(0deg, rgb(1, 114, 250) -4.58%, rgb(1, 114, 250) 25.28%, rgb(1, 68, 169) 68.48%, rgb(1, 22, 87) 100.88%)",
      }}
      className="w-full text-white min-h-screen"
    >
      <MenuSticky />
      <div className="container mx-auto py-6">
        <div className="flex gap-x-4">
          <Button
            radius="sm"
            onClick={() => fileInputRef.current?.click()}
            color="primary"
          >
            Import nhân viên
          </Button>
          {!!staffs?.length && (
            <Button
              radius="sm"
              onClick={handleGenLuckyNumber}
              color="primary"
              isLoading={loadingGenLuckyNumber}
            >
              Tạo số may mắn ({staffs.length} nhân viên)
            </Button>
          )}
        </div>
        <div className="mt-6">
          <Table
            isHeaderSticky
            bottomContent={bottomContent}
            // bottomContentPlacement="outside"
            topContent={topContent}
            // topContentPlacement="outside"
          >
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
            <TableBody
              emptyContent={"Không tìm thấy nhân viên nào"}
              items={displayStaffs}
            >
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
        </div>
        <input
          onChange={handleChange}
          multiple={false}
          ref={fileInputRef}
          type="file"
          hidden
        />
      </div>
    </div>
  );
};

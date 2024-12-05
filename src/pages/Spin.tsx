import { Button, DropdownItem } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight, LuListFilter } from "react-icons/lu";
import { JackpotItem, JackpotResult, MenuSticky } from "../components";
import { MAP_IMAGE_PRIZE, MAPPING_PRIZE_NAME } from "../constants";
import { cn, getListAvaiableStaffsOfPrize } from "../utils";
import { usePrizes, useStaffs } from "../hooks";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const MAX_PRIZE = [1, 1, 2, 2, 5];

export const Spin = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [onSound, setOnSound] = useState(false);
  const [luckyWheelState, setLuckyWheelState] = useState<
    "init" | "running" | "stop"
  >("init");

  const [prize, setPrize] = useState(4);
  const [finished, setFinished] = useState(false);
  const [openResult, setOpenResult] = useState(false);
  const [strips, setStrips] = useState<number[][]>([[], [], []]);
  const { loading, staffs, mutateStaffs } = useStaffs();
  const { prizes, mutatePrizes } = usePrizes();
  const [luckyNumber, setLuckyNumber] = useState<string>();
  const [loadingAccept, setLoadingAccept] = useState(false);

  const pendingStaffs = useMemo(() => {
    return getListAvaiableStaffsOfPrize(staffs, prize);
  }, [staffs, prize]);

  const luckyStaff = useMemo(() => {
    return pendingStaffs.find((el) => el.luckyNumber === luckyNumber);
  }, [pendingStaffs, luckyNumber]);

  const renderPrize = (_prize: number) => {
    return (
      <div className="flex flex-col items-center">
        <img
          className="size-[120px] mt-4"
          src={MAP_IMAGE_PRIZE[_prize]}
          alt="prize"
        />
        <div
          className={cn("text-white h-10 text-xl font-medium mt-3", {
            "animate-blink text-gray-300":
              luckyWheelState === "init" && remainOfPrize > 0,
            "font-semibold text-4xl uppercase mt-2 mb-1": finished,
          })}
        >
          {luckyWheelState !== "init" && !finished && "Đang quay số..."}
          {luckyWheelState === "init" &&
            remainOfPrize > 0 &&
            `Lượt quay thứ ${
              MAX_PRIZE[prize] - remainOfPrize + 1
            } - Nhấn nút Quay số để bắt đầu`}
          {remainOfPrize <= 0 &&
            `${MAPPING_PRIZE_NAME[prize]} có hạn. Chúc các bạn may mắn vào mùa sau!`}
          <AnimatePresence>
            {finished && (
              <motion.span
                variants={{
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.5,
                    },
                  },
                  hidden: {
                    opacity: 0,
                    x: "-100vw",
                  },
                }}
                initial="hidden"
                animate="visible"
                className="inline-block"
              >
                {luckyStaff?.code} -
              </motion.span>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {finished && (
              <motion.span
                variants={{
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.5,
                    },
                  },
                  hidden: {
                    opacity: 0,
                    x: "100vw",
                  },
                }}
                initial="hidden"
                animate="visible"
                className="inline-block ml-1"
              >
                {luckyStaff?.name || luckyStaff?.email}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="w-full flex justify-center">
          <div className="mt-6 overflow-auto">
            <JackpotItem
              strips={strips}
              prize={_prize}
              luckyWheelState={luckyWheelState}
              onFinished={() => {
                if (prize === _prize) {
                  setFinished(true);
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const remainOfPrize = useMemo(() => {
    return MAX_PRIZE[prize] - prizes.filter((el) => el.prize === prize).length;
  }, [prize, prizes]);

  const defaultStrips = useMemo(() => {
    if (pendingStaffs.length === 0) return [[], [], []];
    const luckyNumbers1 = pendingStaffs
      .map((el) => el.luckyNumber)
      .filter(Boolean)
      .map((el) => +el);
    const buildStrip1 = luckyNumbers1.map((el) => Math.floor(el / 100));
    const luckyNumbers2 = luckyNumbers1.map((el) => el % 100);
    const buildStrip2 = luckyNumbers2.map((el) => Math.floor(el / 10));
    const buildStrip3 = luckyNumbers2.map((el) => el % 10);
    return [
      [...new Set(buildStrip1)],
      [...new Set(buildStrip2)],
      [...new Set(buildStrip3)],
    ];
  }, [pendingStaffs]);

  useEffect(() => {
    if (defaultStrips.length !== 3) return;
    setStrips(
      [defaultStrips[0], defaultStrips[1], defaultStrips[2]]
        .map((el) => el.sort(() => 0.5 - Math.random()))
        .map((el, idx) => {
          if (!luckyNumber) return el;
          const targetNumber = +luckyNumber[idx];
          const targetIndex = el.findIndex((el) => el === targetNumber);
          if (targetIndex > 0)
            [el[0], el[targetIndex]] = [el[targetIndex], el[0]];
          return el;
        })
    );
  }, [prize, defaultStrips, luckyNumber]);

  const handleSpin = () => {
    if (remainOfPrize <= 0) return;
    if (!pendingStaffs.length) return;
    setLuckyWheelState("running");
    const _luckyStaff =
      pendingStaffs[Math.floor(pendingStaffs.length * Math.random())];
    setLuckyNumber(_luckyStaff.luckyNumber);
  };

  const handleReject = () => {
    setLuckyWheelState("init");
    setFinished(false);
    setLuckyNumber(undefined);
  };

  const handleAccept = async () => {
    try {
      setLoadingAccept(true);
      const luckyStaff = pendingStaffs.find(
        (el) => el.luckyNumber === luckyNumber
      );
      if (!luckyStaff) return;
      // update to staffs
      const docRef = doc(db, "staffs", luckyStaff.id);
      await updateDoc(docRef, { isWin: true });

      // add to prizes
      const newPrize = doc(collection(db, "prizes"));
      await setDoc(newPrize, {
        code: luckyStaff.code,
        prize,
      });

      await mutateStaffs();
      await mutatePrizes();

      setLuckyWheelState("init");
      setFinished(false);
      setLuckyNumber(undefined);
    } finally {
      setLoadingAccept(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div
      style={{
        background:
          "linear-gradient(0deg, rgb(1, 114, 250) -4.58%, rgb(1, 114, 250) 25.28%, rgb(1, 68, 169) 68.48%, rgb(1, 22, 87) 100.88%)",
      }}
      className="w-full text-white min-h-screen"
    >
      <audio id="audio" loop ref={audioRef}>
        <source src="/music/xsmb.mp3" type="audio/mpeg" />
      </audio>
      <MenuSticky
        soundElement={
          <DropdownItem
            key="sound"
            onClick={() => {
              if (audioRef.current) {
                if (audioRef.current.paused) {
                  setOnSound(true);
                  audioRef.current.play();
                } else {
                  setOnSound(false);
                  audioRef.current.pause();
                }
              }
            }}
          >
            {!onSound ? "Bật nhạc" : "Tắt nhạc"}
          </DropdownItem>
        }
      />

      <div className="pt-16 overflow-hidden flex flex-col items-center">
        <div className="common-gradient drop-shadow-lg text-center uppercase text-[60px] font-bold">
          Prep Lucky Draw
        </div>
        {!loading && pendingStaffs.length === 0 ? null : (
          <>
            <div className="flex justify-start w-full">
              <div className="w-max flex">
                <AnimatePresence>
                  {[4, 3, 2, 1, 0].map((el) => (
                    <motion.div
                      key={el}
                      variants={{
                        visible: {
                          x: (prize - 4) * 100 + "%",
                        },
                      }}
                      initial={false}
                      animate="visible"
                      className="w-screen"
                    >
                      {renderPrize(el)}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            <div className="mt-6">
              <div className="min-w-[200px] flex items-center justify-between rounded-md p-2 bg-[#0D3863] text-white">
                {prize === 4 || luckyWheelState !== "init" ? (
                  <div className="size-6 min-w-6" />
                ) : (
                  <LuChevronLeft
                    onClick={() => {
                      setPrize((prev) => prev + 1);
                    }}
                    className="size-6 min-w-6 cursor-pointer hover:text-yellow-300 hover:scale-110"
                  />
                )}
                <div className="font-semibold">{MAPPING_PRIZE_NAME[prize]}</div>
                {prize === 0 || luckyWheelState !== "init" ? (
                  <div className="size-6 min-w-6" />
                ) : (
                  <LuChevronRight
                    onClick={() => {
                      setPrize((prev) => prev - 1);
                    }}
                    className="size-6 min-w-6 cursor-pointer hover:text-yellow-300 hover:scale-110"
                  />
                )}
              </div>
            </div>
            <div className="my-10 flex gap-x-4">
              {luckyWheelState === "init" && (
                <Button
                  isDisabled={remainOfPrize <= 0}
                  onClick={handleSpin}
                  size="lg"
                  radius="sm"
                  className="font-semibold w-[200px] bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                >
                  QUAY SỐ
                </Button>
              )}
              {luckyWheelState === "running" && (
                <Button
                  onClick={() => setLuckyWheelState("stop")}
                  size="lg"
                  radius="sm"
                  className="font-semibold w-[200px] bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                >
                  CHỐT
                </Button>
              )}
              {luckyWheelState === "stop" &&
                (!finished ? (
                  <div className="h-12"></div>
                ) : (
                  <>
                    <Button
                      isLoading={loadingAccept}
                      onClick={handleAccept}
                      size="lg"
                      radius="sm"
                      className="font-semibold w-[200px] bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                    >
                      XÁC NHẬN
                    </Button>
                    <Button
                      onClick={handleReject}
                      size="lg"
                      radius="sm"
                      className="font-semibold w-[200px] bg-[#0D3863] text-white shadow-lg"
                    >
                      QUAY LẠI
                    </Button>
                  </>
                ))}
            </div>
            <div
              onClick={() => setOpenResult(true)}
              className="mb-6 flex justify-center items-center gap-x-2 cursor-pointer"
            >
              <LuListFilter className="size-6 min-w-6" />
              Kết quả
            </div>
          </>
        )}
      </div>
      <JackpotResult
        prizes={prizes}
        mutatePrizes={async () => {
          await mutatePrizes();
          await mutateStaffs();
        }}
        staffs={staffs}
        open={openResult}
        onClose={() => setOpenResult(false)}
      />
    </div>
  );
};

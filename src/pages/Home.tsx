import { Button } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight, LuListFilter } from "react-icons/lu";
import { JackpotItem, JackpotResult, MenuSticky } from "../components";
import { MAP_IMAGE_PRIZE, MAPPING_PRIZE_NAME } from "../constants";
import { cn } from "../utils";

const strip1 = [0, 1, 2, 3];
const strip2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const strip3 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const Home = () => {
  const [luckyWheelState, setLuckyWheelState] = useState<
    "init" | "running" | "stop"
  >("init");

  const [prize, setPrize] = useState(4);
  const [finished, setFinished] = useState(false);
  const [openResult, setOpenResult] = useState(false);
  const [strips, setStrips] = useState<number[][]>([[], [], []]);

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
            "animate-blink text-gray-300": luckyWheelState === "init",
            "font-semibold text-4xl uppercase mt-2 mb-1": finished,
          })}
        >
          {luckyWheelState !== "init" && !finished && "Đang quay số..."}
          {luckyWheelState === "init" && "Nhấn nút Quay số để bắt đầu"}
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
                F123 -
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
                Trần Tiến Đức
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

  useEffect(() => {
    setStrips(
      [strip1, strip2, strip3].map((el) => el.sort(() => 0.5 - Math.random()))
    );
  }, [prize]);

  return (
    <div
      style={{
        background:
          "linear-gradient(0deg, rgb(1, 114, 250) -4.58%, rgb(1, 114, 250) 25.28%, rgb(1, 68, 169) 68.48%, rgb(1, 22, 87) 100.88%)",
      }}
      className="w-full text-white min-h-screen"
    >
      <MenuSticky />

      <div className="pt-16 overflow-hidden flex flex-col items-center">
        <div className="common-gradient drop-shadow-lg text-center uppercase text-[60px] font-bold">
          Prep Lucky Draw
        </div>
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
              onClick={() => setLuckyWheelState("running")}
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
                  onClick={() => setLuckyWheelState("stop")}
                  size="lg"
                  radius="sm"
                  className="font-semibold w-[200px] bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                >
                  XÁC NHẬN
                </Button>
                <Button
                  onClick={() => {
                    setLuckyWheelState("init");
                    setFinished(false);
                  }}
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
      </div>
      <JackpotResult open={openResult} onClose={() => setOpenResult(false)} />
    </div>
  );
};

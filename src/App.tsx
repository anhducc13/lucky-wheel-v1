import { Button } from "@nextui-org/react";
import { useState } from "react";
import { Strip } from "./components";

function App() {
  const [luckyWheelState, setLuckyWheelState] = useState<
    "init" | "running" | "stop"
  >("init");
  const strip1 = [0, 1, 2, 3];
  const strip2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const strip3 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div
      style={{
        background:
          "linear-gradient(0deg, rgb(1, 114, 250) -4.58%, rgb(1, 114, 250) 25.28%, rgb(1, 68, 169) 68.48%, rgb(1, 22, 87) 100.88%)",
      }}
      className="w-full text-white min-h-screen"
    >
      <div className="pt-16 flex flex-col items-center">
        <div className="common-gradient drop-shadow-lg text-center uppercase text-[60px] font-bold">
          Prep Lucky Draw
        </div>
        <img
          className="size-[120px] mt-4"
          src="/images/gold-prize.svg"
          alt="gold"
        />
        {/* <div
          className={cn("text-white text-xl font-medium mt-3", {
            "animate-blink text-gray-300": !start,
          })}
        >
          {start ? "Đang quay số..." : "Nhấn nút Quay số để bắt đầu"}
        </div> */}
        <div className="mt-6">
          <div className="border-3 rounded-lg border-[#F1C40E] h-[250px] flex gap-x-2 p-1">
            {[strip1, strip2, strip3].map((el, idx) => {
              const direction = 2 * Math.random() > 1 ? "normal" : "reverse";
              return (
                <Strip
                  state={luckyWheelState}
                  listNumbers={el}
                  key={idx}
                  direction={direction}
                />
              );
            })}
          </div>
        </div>
        <div className="mt-6 flex gap-x-4">
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
          {luckyWheelState === "stop" && (
            <Button
              onClick={() => setLuckyWheelState("init")}
              size="lg"
              radius="sm"
              className="font-semibold w-[200px] bg-[#0D3863] text-white shadow-lg"
            >
              QUAY LẠI
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

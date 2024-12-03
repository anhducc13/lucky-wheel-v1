import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../utils";
import { MAP_IMAGE_PRIZE } from "../constants";

type Props = {
  listNumbers: number[];
  state: "init" | "running" | "stop";
  direction?: "normal" | "reverse";
  prize: number;
  onFinished?: () => void;
};

export const Strip: React.FC<Props> = ({
  listNumbers: rands,
  state,
  direction = "normal",
  prize,
  onFinished,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [finishedAnimation, setFinishedAnimation] = useState(false);
  const [count, setCount] = useState(0);

  const animationIterationCount = useMemo(() => {
    if (state === "init") return "none";
    if (state === "running") return "infinite";
    if (state === "stop") return 1;
  }, [state]);

  const animationTimingFunction = useMemo(() => {
    if (state === "stop") return "ease-in-out";
    return "linear";
  }, [state]);

  const animationDuration = useMemo(() => {
    if (state === "running") return 0.1 * rands.length;
    if (state === "stop") return count + (3 + Math.random() * 2);
    return 0;
  }, [state, rands.length, count]);

  useEffect(() => {
    let interval: number | undefined;
    if (state === "running") {
      interval = setInterval(() => {
        setCount((prev) => prev + 1);
      }, 1000);
    } else if (state === "stop") {
      if (interval) clearInterval(interval);
    } else {
      setCount(0);
      setFinishedAnimation(false);
    }

    return () => {
      clearInterval(interval);
    };
  }, [state]);

  useEffect(() => {
    const func = () => {
      setFinishedAnimation(true);
      onFinished?.();
    };
    const currentRef = ref.current;
    if (currentRef) currentRef.addEventListener("animationend", func);

    return () => {
      if (currentRef) currentRef.removeEventListener("animationend", func);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="w-[180px] transition-all overflow-hidden text-[180px] text-white h-full rounded-md bg-[#F1C40E] shadow-lg flex justify-center text-2xl font-bold"
      style={
        {
          "--animation-duration": animationDuration + "s",
          "--animation-to-percent": "-50%",
          "--animation-iteration-count": animationIterationCount,
          "--animation-direction": direction,
          "--animation-timing-functino": animationTimingFunction,
          ...(state === "running"
            ? {
                maskImage:
                  "-webkit-gradient(linear,left top,left bottom,color-stop(0,transparent),color-stop(25%,#000),color-stop(75%,#000),color-stop(100%,transparent))",
              }
            : {}),
        } as React.CSSProperties
      }
    >
      {state === "init" && (
        <div className="h-full flex items-center">
          <img
            className="size-16 min-w-16 opacity-80"
            src={MAP_IMAGE_PRIZE[prize]}
            alt="gold"
          />
        </div>
      )}
      {(state === "running" || state === "stop") && (
        <div
          className={cn(
            "flex flex-col gap-y-0 h-max stripScrollVertical transition-all",
            {
              "opacity-100": state === "stop" && finishedAnimation,
              "opacity-30": !finishedAnimation,
            }
          )}
        >
          {rands.map((num) => (
            <div
              key={num}
              className="h-[236px] min-h-[236px] flex justify-center items-center"
              style={{
                textShadow: "#030303 4px 4px 4px",
              }}
            >
              {num}
            </div>
          ))}
          {rands.map((num) => (
            <div
              key={num + "dup"}
              className="h-[236px] min-h-[236px] flex justify-center items-center"
              style={{
                textShadow: "#030303 4px 4px 4px",
              }}
              aria-hidden="true"
            >
              {num}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import { useEffect, useState } from "react";
import { Strip } from "./Strip";

type Props = {
  prize: number;
  luckyWheelState: "init" | "running" | "stop";
  onFinished?: () => void;
  strips: number[][];
};

export const JackpotItem: React.FC<Props> = ({
  prize,
  luckyWheelState,
  onFinished,
  strips,
}: Props) => {
  const [stopAnimations, setStopAnimations] = useState([false, false, false]);

  useEffect(() => {
    if (luckyWheelState === "running") {
      setStopAnimations([false, false, false]);
    }
  }, [luckyWheelState]);

  useEffect(() => {
    if (stopAnimations.every((el) => el)) {
      onFinished?.();
    }
  }, [JSON.stringify(stopAnimations)]);

  return (
    <div className="border-3 rounded-lg border-[#F1C40E] h-[250px] flex gap-x-2 p-1">
      {strips.map((el, idx) => {
        const direction = 2 * Math.random() > 1 ? "normal" : "reverse";
        return (
          <Strip
            prize={prize}
            state={luckyWheelState}
            listNumbers={el}
            key={idx}
            direction={direction}
            onFinished={() => {
              setStopAnimations((prev) => {
                const newStopAnimations = [...prev];
                newStopAnimations[idx] = true;
                return newStopAnimations;
              });
            }}
          />
        );
      })}
    </div>
  );
};

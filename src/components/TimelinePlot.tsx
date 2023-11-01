import { useContext, useState } from "react";
import usePredictions from "../utils/usePredictions";
import * as d3 from "d3";
import { Emotion, PredictionModels } from "../types/emotionData";
import { PlaybackContext } from "../App";
import { bucketBySecond, topAggregatedEmotions } from "../utils/getTimeBuckets";
import { Separator, Badge } from "@radix-ui/themes";

const TimelinePlot = ({ data }: { data: PredictionModels }) => {
  const { predictions } = usePredictions(data);

  const sections = [
    { title: "Facial expression", data: predictions.face},
    { title: "Vocal burst", data: predictions.burst },
    { title: "Speech prosody", data: predictions.prosody },
    { title: "Language", data: predictions.language },
  ];

  return (
    <div className="w-full h-full rounded-md bg-white text-left overflow-scroll no-scrollbar">
      {sections.map((section, index) => (
        <div key={section.title}>
          <PlotSection
            title={section.title}
            data={section.data}
          />
          {index !== sections.length - 1 && <Separator size={"4"} />}
        </div>
      ))}
    </div>
  );
};

const PlotSection = ({ title, data }: { title: string; data: any }) => {
    
    const buckets = title !== "Facial expression" ? bucketBySecond(data) : (
        bucketBySecond(data.flatMap(item => item.predictions))
    );
    
  return (
    <div className="p-4">
      <div className="w-full flex justify-between mb-4">
        <span className="font-semibold">{title}</span>
        <ul className="flex gap-2">
            {topAggregatedEmotions(buckets).map(item => (
                <Badge key={item.name}>{item.name}</Badge>
            ))}
        </ul>
      </div>
      <svg viewBox="0 0 150 10">
        <g>
          {Object.keys(buckets).map((key) => (
            <EmotionCircle
                key={key}
                emotions={buckets[key].emotions}
                time={buckets[key].time}
          />
          ))}
        </g>
      </svg>
    </div>
  );
};

const EmotionCircle = ({
  emotions,
  time,
}: {
  emotions: Emotion[];
  time: number;
}) => {
  const { setCurrentTime } = useContext(PlaybackContext);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  let scale = d3.scalePow().exponent(1.5).domain([0, 1]).range([0.5, 4]);

  let radius = emotions.length ? scale(
        emotions.reduce((total, emotion) => total + emotion.score, 0) /
          emotions.length,
      )
    : 0;

    const handleHover = () => {
        setIsHovered(true);
        setCurrentTime(time);
    }

  return (
    <circle
      cx={time}
      cy={5}
      r={radius}
      className="fill-stone-400"
      onClick={() => setCurrentTime(time)}
      onPointerEnter={handleHover}
      onPointerLeave={() => setIsHovered(false)}
    ></circle>
  );
};

export default TimelinePlot;

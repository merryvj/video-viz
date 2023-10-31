import "./App.css";
import { useState, useRef, createContext, useContext } from "react";
import response from "./assets/data.json";
import VideoPlayer from "./components/VideoPlayer";
import {
  BurstPrediction,
  FacePrediction,
  LanguagePrediction,
  ProsodyPrediction,
} from "./types/emotionData";
import PredictionView from "./components/PredictionView";

interface PlaybackContext {
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
}

export const PlaybackContext = createContext<PlaybackContext>({
  currentTime: 0,
  setCurrentTime: () => {},
});

function App() {
  const [emotion, setEmotion] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  const results: any = response && response.results.predictions[0].models;

  const faces: any = results.face.grouped_predictions;

  const flattened = faces
    .map((face) =>
      face.predictions.map((prediction) => ({
        id: parseInt(face.id.split("_")[1]),
        time: prediction.time,
        emotions: prediction.emotions,
      })),
    )
    .flat();

  const sorted = flattened.sort((a, b) => a.time - b.time);

  const groupedByTime = {};

  for (const face of faces) {
    for (const prediction of face.predictions) {
      const time = prediction.time;
      if (!groupedByTime[time]) {
        groupedByTime[time] = [];
      }
      groupedByTime[time].push({ ...prediction, id: face.id });
    }
  }

  const handleClick = (e: React.UIEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log(results);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setCurrentTime(currentTime);

      const closestData = findRelevantData(currentTime);

      if (closestData) {
        const emotions = closestData.map((item) =>
          getTopEmotions(item.emotions),
        );
        setEmotion(emotions[0].map((emotion) => emotion.name).join(" "));
      }
    }
  };

  function findRelevantData(currentTime) {
    let closestData = null;
    for (const time in groupedByTime) {
      if (Math.floor(parseInt(time)) === Math.floor(currentTime)) {
        closestData = groupedByTime[time];
        break;
      }
    }
    return closestData;
  }

  const getTopEmotions = (emotions) => {
    const sorted = emotions.sort((a, b) => b.score - a.score);
    return sorted.slice(0, 3);
  };

  return (
    <PlaybackContext.Provider value={{ currentTime, setCurrentTime }}>
      <div onClick={handleClick} className="flex flex-row">
        <div className="basis-2/3">
          <VideoPlayer />
        </div>
        <div className="flex-1">
          <PredictionView data={results} />
        </div>
      </div>
    </PlaybackContext.Provider>
  );
}

export default App;

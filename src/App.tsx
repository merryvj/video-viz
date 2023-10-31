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
  const [currentTime, setCurrentTime] = useState<number>(0);
  const results: any = response && response.results.predictions[0].models;

  return (
    <PlaybackContext.Provider value={{ currentTime, setCurrentTime }}>
      <main className="min-h-screen w-screen bg-slate-50 p-4 g-">
        <div className="flex flex-row gap-4 h-full">
          <div className="basis-2/3 h-full">
            <VideoPlayer />
          </div>
          <div className="flex-1">
            <PredictionView data={results} />
          </div>
        </div>
      </main>
    </PlaybackContext.Provider>
  );
}

export default App;

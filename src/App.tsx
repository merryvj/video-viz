import "./App.css";
import { useState, createContext } from "react";
import VideoPlayer from "./components/VideoPlayer";
import PredictionView from "./components/PredictionView";
import TimelinePlot from "./components/TimelinePlot";
import response from "./assets/data.json";

const results: any = response && response.results.predictions[0].models;


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

  console.log(results)
  return (
    <PlaybackContext.Provider value={{ currentTime, setCurrentTime }}>
      <main className="h-screen w-screen bg-stone-100 p-4 overflow-hidden text-stone-700">
        <div className="h-full w-full grid grid-cols-3 grid-rows-1 gap-4 ">
          <div className="col-span-2 flex flex-col gap-4">
            <VideoPlayer />
            <div className="h-full overflow-hidden">
              <TimelinePlot data={results} />
            </div>
          </div>
          <div className="h-full col-span-1 overflow-hidden">
            <PredictionView data={results} />
          </div>
        </div>
      </main>
    </PlaybackContext.Provider>
  );
}

export default App;

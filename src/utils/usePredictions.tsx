// hooks/useEmotions.tsx
import { useContext } from "react";
import { PlaybackContext } from "../App";
import {
  BurstPrediction,
  LanguagePrediction,
  ProsodyPrediction,
  Emotion,
  PredictionModels
} from "../types/emotionData";



const usePredictions = (data: PredictionModels) => {
  const { currentTime } = useContext(PlaybackContext);
  const { burst, face, language, prosody } = data;

  const burstPredictions = burst.grouped_predictions.length > 0 ? burst.grouped_predictions[0].predictions : [];
  const languagePredictions = language.grouped_predictions.length > 0 ? language.grouped_predictions[0].predictions : [];
  const prosodyPredictions = prosody.grouped_predictions.length > 0 ? prosody.grouped_predictions[0].predictions : [];


  const predictionAtTime = (items: any[]) => {
    const relevantItems = items.filter((item) =>
      item.predictions.find(
        (prediction) => Math.floor(prediction.time) === Math.floor(currentTime),
      ),
    );

    if (!relevantItems) return;
    return relevantItems.map((relevant) => ({
      id: parseInt(relevant.id.split("_")[1]),
      predictions: relevant.predictions.find(
        (item) => Math.floor(item.time) === Math.floor(currentTime),
      ),
    }));
  };

  const predictionInRange = (
    items: BurstPrediction[] | LanguagePrediction[] | ProsodyPrediction[],
  ) => {
    return (
      items as Array<BurstPrediction | LanguagePrediction | ProsodyPrediction>
    ).find(
      (item) => item.time.begin <= currentTime && item.time.end >= currentTime,
    );
  };
  

const topEmotions = (emotions: Emotion[]) => {
  const sorted = [...emotions].sort((a, b) => b.score - a.score);
  return sorted.slice(0, 3);
};

  const predictions = {
    burst: predictionInRange(burstPredictions),
    face: predictionAtTime(face.grouped_predictions),
    language: predictionInRange(languagePredictions),
    prosody: predictionInRange(prosodyPredictions),
  };

  const emotions = {
    burst: predictions.burst ? topEmotions(predictions.burst.emotions) : null,
    face: predictions.face ? predictions.face.map(item => ({id: item.id, emotions: topEmotions(item.predictions.emotions)})) : [],
    language: predictions.language ? topEmotions(predictions.language.emotions) : null,
    prosody: predictions.prosody ? topEmotions(predictions.prosody.emotions) : null,
  };

  return {predictions, emotions};
}

export default usePredictions;




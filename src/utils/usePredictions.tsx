// hooks/useEmotions.tsx
import { useContext } from 'react';
import { PlaybackContext } from '../App';
import {
    BurstPrediction,
    LanguagePrediction,
    ProsodyPrediction,
    Emotion,
    PredictionModels,
} from '../types/predictions';

const usePredictions = (data: PredictionModels) => {
    const { currentTime } = useContext(PlaybackContext);
    const { burst, face, language, prosody } = data;

    const predictions = {
        burst:
            burst.grouped_predictions.length > 0
                ? burst.grouped_predictions[0].predictions
                : [],
        face: face.grouped_predictions,
        language:
            language.grouped_predictions.length > 0
                ? language.grouped_predictions[0].predictions
                : [],
        prosody:
            prosody.grouped_predictions.length > 0
                ? prosody.grouped_predictions[0].predictions
                : [],
    };

    const predictionAtTime = (items: any[]) => {
        const relevantItems = items.filter((item) =>
            item.predictions.find(
                (prediction) =>
                    Math.floor(prediction.time) === Math.floor(currentTime)
            )
        );

        if (!relevantItems) return;
        return relevantItems.map((relevant) => ({
            id: parseInt(relevant.id.split('_')[1]) + 1,
            predictions: relevant.predictions.find(
                (item) => Math.floor(item.time) === Math.floor(currentTime)
            ),
        }));
    };

    const predictionInRange = (
        items: BurstPrediction[] | LanguagePrediction[] | ProsodyPrediction[]
    ) => {
        return (
            items as Array<
                BurstPrediction | LanguagePrediction | ProsodyPrediction
            >
        ).find(
            (item) =>
                item.time.begin <= currentTime && item.time.end >= currentTime
        );
    };

    const topEmotions = (emotions: Emotion[]) => {
        const sorted = [...emotions].sort((a, b) => b.score - a.score);
        return sorted.slice(0, 3);
    };

    const rangedPredictions = {
        burst: predictionInRange(predictions.burst),
        face: predictionAtTime(predictions.face),
        language: predictionInRange(predictions.language),
        prosody: predictionInRange(predictions.prosody),
    };

    const emotions = {
        burst: rangedPredictions.burst
            ? topEmotions(rangedPredictions.burst.emotions)
            : null,
        face: rangedPredictions.face
            ? rangedPredictions.face.map((item) => ({
                  id: item.id,
                  emotions: topEmotions(item.predictions.emotions),
              }))
            : [],
        language: rangedPredictions.language
            ? topEmotions(rangedPredictions.language.emotions)
            : null,
        prosody: rangedPredictions.prosody
            ? topEmotions(rangedPredictions.prosody.emotions)
            : null,
    };

    return { predictions, emotions };
};

export default usePredictions;

import { Emotion } from '../types/predictions';

interface EmotionBucket {
    time: number;
    emotions: Emotion[];
}

export function bucketBySecond(predictions: any[]): {
    [key: string]: any | null;
} {
    let duration = 150;

    const buckets: { [key: number]: EmotionBucket } = {};
    for (let index = 0; index < duration; index++) {
        buckets[index] = {
            time: index,
            emotions: [],
        };
    }

    predictions.forEach((prediction) => {
        const bucketKey = Math.floor(prediction.time.begin ?? prediction.time);
        buckets[bucketKey] = {
            time: bucketKey,
            emotions: prediction.emotions
                .sort((a, b) => b.score - a.score)
                .slice(0, 3),
        };
    });

    return buckets;
}

export function topAggregatedEmotions(buckets: any): Emotion[] {
    const allEmotions = Object.values(buckets).flatMap(
        (bucket) => bucket.emotions
    );

    const aggregatedEmotions = allEmotions.reduce((acc, emotion) => {
        const existingEmotion = acc.find((e) => e.name === emotion.name);
        if (existingEmotion) {
            existingEmotion.score += emotion.score;
        } else {
            acc.push({ ...emotion });
        }
        return acc;
    }, []);

    const topEmotions = aggregatedEmotions
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    return topEmotions;
}

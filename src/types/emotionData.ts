export interface Emotion {
  name: string;
  score: number;
}

export interface Description {
  name: string;
  score: number;
}

export interface TimeRange {
  begin: number;
  end: number;
}

export interface BurstPrediction {
  time: TimeRange;
  emotions: Emotion[];
  descriptions: Description[];
}

export interface FacePrediction {
  frame: number;
  time: number;
  prob: number;
  box: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  emotions: Emotion[];
  facs: Emotion[];
  descriptions: Description[];
}

export interface LanguagePrediction {
  text: string;
  position: TimeRange;
  time: TimeRange;
  confidence: number;
  speaker_confidence: number | null;
  emotions: Emotion[];
  sentiment: Emotion[];
  toxicity: Emotion[];
}

export interface ProsodyPrediction {
  text: string;
  time: TimeRange;
  confidence: null | number;
  speaker_confidence: null | number;
  emotions: Emotion[];
}

export interface PredictionModels {
  burst: {
    grouped_predictions: {
      id: string;
      predictions: BurstPrediction[];
    }[];
  };
  face: {
    grouped_predictions: {
      id: string;
      predictions: FacePrediction[];
    }[];
  };
  language: {
    grouped_predictions: {
      id: string;
      predictions: LanguagePrediction[];
    }[];
  };
  prosody: {
    grouped_predictions: {
      id: string;
      predictions: ProsodyPrediction[];
    }[];
  };
}

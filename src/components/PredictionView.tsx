import usePredictions from '../utils/usePredictions';
import { PredictionModels } from "../types/emotionData";


interface PredictionViewProps {
  data: PredictionModels;
}

const PredictionView = (props: PredictionViewProps) => {
    const {predictions, emotions} = usePredictions(props.data);
  return <div>
    
  </div>;
};

export default PredictionView;

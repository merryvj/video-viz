import { useState } from 'react';
import usePredictions from '../utils/usePredictions';
import { PredictionModels } from "../types/emotionData";
import { Emotion } from '../types/emotionData';
import { Select } from '@radix-ui/themes';


interface PredictionViewProps {
  data: PredictionModels;
}

const PredictionView = (props: PredictionViewProps) => {
    const {emotions} = usePredictions(props.data);
    const {burst, face, language, prosody} = emotions;
    const [selectedValue, setSelectedValue] = useState<string>("face");

    const renderEmotions = () => {
        switch (selectedValue) {
          case "burst":
            return <TopEmotions emotions={burst} />;
          case "language":
            return <TopEmotions emotions={language} />;
          case "prosody":
            return <TopEmotions emotions={prosody} />;
          case "face":
            return face.map((person, index) => (
              <TopEmotions key={index} emotions={person.emotions} />
            ));
          default:
            return null;
        }
    };
  
  return <div>
        <Select.Root defaultValue="face" onValueChange={setSelectedValue}>
        <Select.Trigger />
        <Select.Content>
            <Select.Item value="face">Facial expression</Select.Item>
            <Select.Item value="burst">Vocal burst</Select.Item>
            <Select.Item value="prosody">Speech prosody</Select.Item>
            <Select.Item value="language">Language</Select.Item>
        </Select.Content>
    </Select.Root>
    {renderEmotions()}
  </div>;
};

interface TopEmotionsProps {
    emotions: Emotion[] | null
}

const TopEmotions = ({emotions}:TopEmotionsProps) => {
    if (!emotions) return null;

    return (
        <ul className='flex flex-col'>
            {
                emotions?.map(emotion => (
                    <li>{emotion.name} {emotion.score.toFixed(2)}</li>
                    ))
            }
        </ul>
    )
}
export default PredictionView;

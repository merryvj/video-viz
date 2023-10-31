import { useState } from 'react';
import usePredictions from '../utils/usePredictions';
import { PredictionModels } from "../types/emotionData";
import { Emotion } from '../types/emotionData';
import { Select, Separator, Badge } from '@radix-ui/themes';
import * as Progress from '@radix-ui/react-progress';



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
            return (
                <ul className='flex flex-col gap-4'>
                    {face
                        .sort((a, b) => a.id - b.id)
                        .map((person, index) => (
                            <>
                                <li key={index}>
                                <Badge className='mb-4'>P{person.id + 1}</Badge>
                                <TopEmotions emotions={person.emotions} />
                                </li>
                                {(index < face.length - 1) && <Separator size={"4"} className='mt-1'/>}
                            </>
                        ))}
                </ul>
            )
          default:
            return null;
        }
    };
  
  return <div className='h-full flex flex-col bg-white rounded-md no-scrollbar'>
    <div className='p-4 text-left'>
        <Select.Root defaultValue="face" onValueChange={setSelectedValue}>
            <Select.Trigger />
            <Select.Content>
                <Select.Item value="face">Facial expression</Select.Item>
                <Select.Item value="burst">Vocal burst</Select.Item>
                <Select.Item value="prosody">Speech prosody</Select.Item>
                <Select.Item value="language">Language</Select.Item>
            </Select.Content>
        </Select.Root>
    </div>
    <Separator size="4" />
    <div className='p-4 text-left'>
     {renderEmotions()}
    </div>
  </div>;
};

interface TopEmotionsProps {
    emotions: Emotion[] | null
}

const TopEmotions = ({emotions}:TopEmotionsProps) => {
    if (!emotions) return null;

    return (
        <ul className='flex flex-col gap-4'>
            {
                emotions?.map(emotion => (
                    <li className='h-full w-full'>
                        <span className='mr-1'>
                        {emotion.name}
                        </span>
                        <span className='text-stone-400'>
                        {emotion.score.toFixed(2)}
                        </span>
                        <Progress.Root className='h-2 w-full mt-1 bg-stone-50 overflow-hidden rounded-full translate-z-0' value={emotion.score}>
                        <Progress.Indicator className='h-full w-full bg-stone-400 transition-all duration-500' style={{ transform: `translateX(-${100 - emotion.score * 100}%)` }}/>
                        </Progress.Root>
                    </li>
                ))
            }
        </ul>
    )
}
export default PredictionView;

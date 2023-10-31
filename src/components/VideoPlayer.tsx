import { useContext, useRef } from "react";
import { PlaybackContext } from "../App";

const VideoPlayer = () => {
  const { setCurrentTime } = useContext(PlaybackContext);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
    }
  };

  return (
    <video
      ref={videoRef}
      onTimeUpdate={handleTimeUpdate}
      width={"100%"}
      controls
      src="/video.mp4"
    ></video>
  );
};

export default VideoPlayer;

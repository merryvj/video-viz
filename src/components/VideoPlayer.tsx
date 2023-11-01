import { useContext, useRef, useEffect } from "react";
import { PlaybackContext } from "../App";

const VideoPlayer = () => {
  const { currentTime, setCurrentTime } = useContext(PlaybackContext);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      if (!videoRef.current.paused) return;
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  return (
    <video
      ref={videoRef}
      onTimeUpdate={handleTimeUpdate}
      width={"100%"}
      controls
      src="/video.mp4"
      className="rounded-md"
    ></video>
  );
};

export default VideoPlayer;

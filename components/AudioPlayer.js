import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/AudioPlayer.module.css";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { FaPlay, FaPause } from "react-icons/fa";

const calculateTime = (secsDouble) => {
  const totalSeconds = Math.floor(secsDouble);
  const hours = Math.floor(totalSeconds / 3600);
  const newTotalSeconds = totalSeconds % 3600;
  const minutes = Math.floor(newTotalSeconds / 60);
  const seconds = newTotalSeconds % 60;
  return `${hours.toString().padStart(2, 0)}:${minutes
    .toString()
    .padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`;
};
const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioPlayerRef = useRef();
  const progressBarRef = useRef();
  const animationRef = useRef(); // Animate when the player is playing

  useEffect(() => {
    const durationSecs = audioPlayerRef.current.duration;
    setDuration(durationSecs);
    progressBarRef.current.max = durationSecs;
  }, [audioPlayerRef?.current?.loadedmetadata]);

  const audioFile =
    "https://upload.wikimedia.org/wikipedia/commons/transcoded/d/d1/220_Hz_sine_wave.ogg/220_Hz_sine_wave.ogg.mp3";

  const whilePlaying = () => {
    progressBarRef.current.value = audioPlayerRef.current.currentTime;
    updatePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
    console.log("time", audioPlayerRef.current.currentTime);
    if (audioPlayerRef.current.currentTime >= duration - 0.001) {
      cancelAnimationFrame(animationRef.current);
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const updatePlayerCurrentTime = () => {
    const progress = progressBarRef.current.value;
    const percent = (100 * progress) / duration;
    progressBarRef.current.style.setProperty(
      "--seek-before-width",
      `${percent}%`
    );
    setCurrentTime(progressBarRef.current.value);
  };

  const skipSeconds = (seconds) => {
    progressBarRef.current.value = Number(
      progressBarRef.current.value + seconds
    );
    knobMoved();
  };

  const togglePlayPause = () => {
    const wasPlaying = isPlaying;
    setIsPlaying(!wasPlaying);

    if (!wasPlaying) {
      audioPlayerRef.current.play();
      // Start moving the knob

      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayerRef.current.pause();
      // Cancel moving the knob
      cancelAnimationFrame(animationRef.current);
    }
    setIsPlaying(!isPlaying);
  };

  const knobMoved = () => {
    const progress = progressBarRef.current.value;
    audioPlayerRef.current.currentTime = progress;
    updatePlayerCurrentTime();
  };

  return (
    <div className={styles.audioPlayer}>
      <audio ref={audioPlayerRef} src={audioFile} preload="metadata"></audio>
      <button
        className={styles.forwardBackward}
        onClick={() => skipSeconds(-30)}
      >
        <BsArrowLeftShort /> 30
      </button>
      <button onClick={togglePlayPause} className={styles.playPause}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <button
        className={styles.forwardBackward}
        onClick={() => skipSeconds(30)}
      >
        30
        <BsArrowRightShort />
      </button>
      <div className={styles.currentTime}>{calculateTime(currentTime)}</div>
      <div>
        <input
          ref={progressBarRef}
          type="range"
          className={styles.progressBar}
          defaultValue="0"
          onChange={knobMoved}
        ></input>
      </div>
      <div className={styles.duration}>{calculateTime(duration)}</div>
    </div>
  );
};

export { AudioPlayer };

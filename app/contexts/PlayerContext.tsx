import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import ReactPlayer from 'react-player/youtube';
import { useDebouncedCallback } from 'use-debounce';
import type { Video, Videos } from '~/types/discojs';

interface Progress {
  loaded: number;
  loadedSeconds: number;
  played: number;
  playedSeconds: number;
}

function initialProgress() {
  return {
    loaded: 0,
    loadedSeconds: 0,
    played: 0,
    playedSeconds: 0,
  };
}

interface PlayerContextValue {
  disabled: boolean;
  duration: number | null;
  handleNext: () => void;
  handlePlayPause: () => void;
  handlePrevious: () => void;
  handleSkipBackward: () => void;
  handleSkipForward: () => void;
  index: number;
  isNextDisabled: boolean;
  isPlayPauseDisabled: boolean;
  isPreviousDisabled: boolean;
  isSkipBackwardDisabled: boolean;
  isSkipForwardDisabled: boolean;
  playing: boolean;
  progress: Progress;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setVideos: React.Dispatch<React.SetStateAction<Videos>>;
  video: Video | undefined;
  videos: Videos;
}

const PlayerContext = React.createContext<PlayerContextValue | null>(null);

const DEBOUNCE_MS = 50;

const SKIP_SECONDS = 30;

export function PlayerProvider({ children }: React.PropsWithChildren<{}>) {
  const playerRef = React.useRef<ReactPlayer>(null);

  const [disabled, setDisabled] = React.useState(false);

  const [videos, setVideos] = React.useState<Videos>([]);

  const [index, setIndex] = React.useState(0);

  const video = videos.length > 0 ? videos[index] : undefined;

  React.useEffect(() => {
    setIndex(0);
  }, [videos]);

  const [playing, setPlaying] = React.useState(false);

  const [progress, setProgress] = React.useState<Progress>(initialProgress());

  const handleProgress = (value: Progress) => {
    setProgress(value);
  };

  const [duration, setDuration] = React.useState<number | null>(null);

  React.useEffect(() => {
    setDuration(playerRef.current?.getDuration() ?? null);
  }, [index, progress]);

  const isPlayPauseDisabled = disabled || videos.length === 0;

  const isPreviousDisabled = disabled || index <= 0;

  const isNextDisabled = disabled || index >= videos.length - 1;

  const isSkipBackwardDisabled =
    disabled || duration === null || progress.playedSeconds - SKIP_SECONDS < 0;

  const isSkipForwardDisabled = disabled || duration === null;

  const handleEnded = () => {
    if (!isNextDisabled) {
      setIndex((prev) => prev + 1);
    }
  };

  const handlePlayPause = useDebouncedCallback(() => {
    if (!isPlayPauseDisabled) {
      setPlaying((prev) => !prev);
    }
  }, DEBOUNCE_MS);

  const handlePrevious = useDebouncedCallback(() => {
    if (!isPreviousDisabled) {
      setIndex((prev) => (prev > 0 ? prev - 1 : 0));
      setProgress(initialProgress());
    }
  }, DEBOUNCE_MS);

  const handleNext = useDebouncedCallback(() => {
    if (!isNextDisabled) {
      setIndex((prev) =>
        prev < videos.length - 1 ? prev + 1 : videos.length - 1
      );
      setProgress(initialProgress());
    }
  }, DEBOUNCE_MS);

  const handleSkipBackward = useDebouncedCallback(() => {
    if (!isSkipBackwardDisabled) {
      const seconds = Math.max(progress.playedSeconds - SKIP_SECONDS, 0);
      playerRef.current?.seekTo(seconds);
    }
  }, DEBOUNCE_MS);

  const handleSkipForward = useDebouncedCallback(() => {
    if (!isSkipForwardDisabled) {
      const seconds = progress.playedSeconds + SKIP_SECONDS;
      if (seconds >= duration) {
        handleNext();
      } else {
        playerRef.current?.seekTo(Math.min(seconds, progress.loadedSeconds));
      }
    }
  }, DEBOUNCE_MS);

  useHotkeys('space', (event) => {
    event.preventDefault();
    handlePlayPause();
  });
  useHotkeys('alt+left', handlePrevious);
  useHotkeys('alt+right', handleNext);
  useHotkeys('left', handleSkipBackward);
  useHotkeys('right', handleSkipForward);

  const value = {
    disabled,
    duration,
    handleNext,
    handlePlayPause,
    handlePrevious,
    handleSkipBackward,
    handleSkipForward,
    index,
    isNextDisabled,
    isPlayPauseDisabled,
    isPreviousDisabled,
    isSkipBackwardDisabled,
    isSkipForwardDisabled,
    playing,
    progress,
    setDisabled,
    setVideos,
    video,
    videos,
  };

  // workaround for `failed to execute 'postMessage'`
  // https://github.com/cookpete/react-player/issues/508
  const uri = video?.uri.includes('/watch?v=')
    ? video?.uri.replace('/watch?v=', '/embed/')
    : video?.uri;

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <div className="hidden">
        <ReactPlayer
          controls={false}
          height={200}
          onEnded={handleEnded}
          onProgress={handleProgress}
          playing={playing}
          ref={playerRef}
          url={uri}
          width={200}
        />
      </div>
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = React.useContext(PlayerContext);

  if (context === null) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }

  return context;
}

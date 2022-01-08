import React from 'react';
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
  duration: number | null;
  handleEnded: () => void;
  handleNext: () => void;
  handlePlayPause: () => void;
  handlePrevious: () => void;
  handleProgress: (progress: Progress) => void;
  index: number;
  isNextDisabled: boolean;
  isPlayPauseDisabled: boolean;
  isPreviousDisabled: boolean;
  playing: boolean;
  progress: Progress;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setVideos: React.Dispatch<React.SetStateAction<Videos>>;
  video: Video | undefined;
  videos: Videos;
}

const PlayerContext = React.createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: React.PropsWithChildren<{}>) {
  const [disabled, setDisabled] = React.useState(false);

  const [videos, setVideos] = React.useState<Videos>([]);

  const [index, setIndex] = React.useState(0);

  const video = videos.length > 0 ? videos[index] : undefined;

  const [playing, setPlaying] = React.useState(false);

  const [progress, setProgress] = React.useState<Progress>(initialProgress());

  const [duration, setDuration] = React.useState<number | null>(null);

  React.useEffect(() => {
    setDuration(
      progress.played === 0 ? null : progress.playedSeconds / progress.played
    );
  }, [progress]);

  const isPreviousDisabled = disabled ?? index <= 0;

  const isPlayPauseDisabled = disabled ?? videos.length === 0;

  const isNextDisabled = disabled ?? index >= videos.length - 1;

  const handleEnded = () => {
    if (!isNextDisabled) {
      setIndex((prev) => prev + 1);
    }
  };

  const handleProgress = (value: Progress) => {
    setProgress(value);
  };

  const handlePrevious = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : 0));
    setProgress(initialProgress());
  };

  const handlePlayPause = () => {
    setPlaying((prev) => !prev);
  };

  const handleNext = () => {
    setIndex((prev) =>
      prev < videos.length - 1 ? prev + 1 : videos.length - 1
    );
    setProgress(initialProgress());
  };

  const value = {
    duration,
    handleEnded,
    handleNext,
    handlePlayPause,
    handlePrevious,
    handleProgress,
    index,
    isNextDisabled,
    isPlayPauseDisabled,
    isPreviousDisabled,
    playing,
    progress,
    setDisabled,
    setVideos,
    video,
    videos,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = React.useContext(PlayerContext);

  if (context === null) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }

  return context;
}

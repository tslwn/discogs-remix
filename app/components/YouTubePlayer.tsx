import React from 'react';
import ReactPlayer from 'react-player/youtube';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PauseIcon,
  PlayIcon,
} from '~/components/Icon';
import useElementSize from '~/hooks/useElementSize';
import type { Release } from '~/types/discojs';

function initialProgress() {
  return {
    loaded: 0,
    loadedSeconds: 0,
    played: 0,
    playedSeconds: 0,
  };
}

interface YouTubePlayerProps {
  videos: Exclude<Release['videos'], undefined>;
}

export default function YouTubePlayer({ videos }: YouTubePlayerProps) {
  const [playerRef, { width: playerWidth }] = useElementSize();

  const [index, setIndex] = React.useState(0);

  const video = videos[index];

  const [playing, setPlaying] = React.useState(false);

  const [progress, setProgress] = React.useState(initialProgress());

  const isPlayPauseDisabled = videos.length === 0;

  const isPreviousDisabled = index <= 0;

  const isNextDisabled = index >= videos.length - 1;

  return (
    <div ref={playerRef}>
      <ReactPlayer
        height={0}
        onProgress={(value) => {
          setProgress(value);
        }}
        playing={playing}
        url={video.uri}
        width={playerWidth}
      />
      <div className="flex items-center justify-center mb-2">
        <button
          className={'mr-2' + (isPreviousDisabled ? ' cursor-not-allowed' : '')}
          disabled={isPreviousDisabled}
          onClick={() => {
            setIndex((prev) => (prev > 0 ? prev - 1 : 0));
            setProgress(initialProgress());
          }}
        >
          <ArrowLeftIcon
            className={'h-5 w-5' + (isPreviousDisabled ? ' fill-gray-400' : '')}
          />
        </button>
        <button
          aria-label={playing ? 'Pause' : 'Play'}
          className={
            'mr-2' + (isPlayPauseDisabled ? ' cursor-not-allowed' : '')
          }
          disabled={isPlayPauseDisabled}
          onClick={() => {
            setPlaying((prev) => !prev);
          }}
          title={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <PauseIcon className="h-12 w-12" />
          ) : (
            <PlayIcon className="h-12 w-12" />
          )}
        </button>
        <button
          className={isNextDisabled ? 'cursor-not-allowed' : undefined}
          disabled={isNextDisabled}
          onClick={() => {
            setIndex((prev) =>
              prev < videos.length - 1 ? prev + 1 : videos.length - 1
            );
            setProgress(initialProgress());
          }}
        >
          <ArrowRightIcon
            className={'h-5 w-5' + (isNextDisabled ? ' fill-gray-400' : '')}
          />
        </button>
      </div>
      <div className="bg-gray-100 h-1 mb-2 w-full">
        <div
          className="bg-gray-300 h-1"
          style={{ width: `${progress.loaded * 100}%` }}
        >
          <div
            className="bg-black h-1"
            style={{ width: `${progress.played * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="text-center text-sm">
        <h3
          className="hover:underline overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ width: playerWidth }}
        >
          <a href={video.uri} rel="noreferrer" target="_blank">
            {video.title}
          </a>
        </h3>
        <p>
          {index + 1} / {videos.length}
        </p>
      </div>
    </div>
  );
}

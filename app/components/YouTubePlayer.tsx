import React from 'react';
import ReactPlayer from 'react-player/youtube';
import useElementSize from '~/hooks/useElementSize';
import type { Release } from '~/types/discojs';
import IconButton from './IconButton';

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
  const [containerRef, { width: playerWidth }] = useElementSize();

  const [index, setIndex] = React.useState(0);

  const video = videos[index];

  const [playing, setPlaying] = React.useState(false);

  const [progress, setProgress] = React.useState(initialProgress());

  const [duration, setDuration] = React.useState<number | null>(null);

  React.useEffect(() => {
    setDuration(
      progress.played === 0 ? null : progress.playedSeconds / progress.played
    );
  }, [progress]);

  const isPlayPauseDisabled = videos.length === 0;

  const isPreviousDisabled = index <= 0;

  const isNextDisabled = index >= videos.length - 1;

  return (
    <div className="px-4 w-1/2" ref={containerRef}>
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
        <IconButton
          aria-label="Previous video"
          className="mr-2"
          disabled={isPreviousDisabled}
          iconProps={{
            className: 'h-5 w-5',
            icon: 'ArrowSmLeft',
          }}
          onClick={() => {
            setIndex((prev) => (prev > 0 ? prev - 1 : 0));
            setProgress(initialProgress());
          }}
          title="Previous video"
        />
        <IconButton
          aria-label={playing ? 'Pause video' : 'Play video'}
          className="mr-2"
          disabled={isPlayPauseDisabled}
          iconProps={{
            className: 'h-8 w-8',
            icon: playing ? 'Pause' : 'Play',
          }}
          onClick={() => {
            setPlaying((prev) => !prev);
          }}
          title={playing ? 'Pause video' : 'Play video'}
        />
        <IconButton
          aria-label="Next video"
          disabled={isNextDisabled}
          iconProps={{
            className: 'h-5 w-5',
            icon: 'ArrowSmRight',
          }}
          onClick={() => {
            setIndex((prev) =>
              prev < videos.length - 1 ? prev + 1 : videos.length - 1
            );
            setProgress(initialProgress());
          }}
          title="Next video"
        />
      </div>
      <div className="flex items-center">
        <div className="mr-2 text-xs w-8">
          {formatSeconds(progress.playedSeconds)}
        </div>
        <div className="bg-gray-100 h-1 w-full">
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
        <div className="ml-2 text-xs w-8">
          {duration ? formatSeconds(duration) : '--:--'}
        </div>
      </div>
      <div
        className="hover:underline mx-auto overflow-hidden text-center text-ellipsis text-xs whitespace-nowrap"
        style={{ width: playerWidth - 64 }}
      >
        <a href={video.uri} rel="noreferrer" target="_blank">
          {video.title} ({index + 1} / {videos.length})
        </a>
      </div>
    </div>
  );
}

function formatSeconds(value: number) {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value - hours * 3600) / 60);
  const seconds = Math.round(value - hours * 3600 - minutes * 60);

  let formatted = '';
  formatted += hours > 0 ? hours.toString() + ':' : '';
  formatted += minutes.toString() + ':';
  formatted += seconds < 10 ? '0' : '';
  formatted += seconds.toString();

  return formatted;
}

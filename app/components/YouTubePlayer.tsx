import ReactPlayer from 'react-player/youtube';
import {
  ArrowSmLeftIcon,
  ArrowSmRightIcon,
  PauseIcon,
  PlayIcon,
} from '@heroicons/react/solid';
import Button from '~/components/Button';
import useElementSize from '~/hooks/useElementSize';
import { usePlayer } from '~/contexts/PlayerContext';

export default function YouTubePlayer() {
  const [containerRef, { width: playerWidth }] = useElementSize();

  const {
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
    video,
    videos,
  } = usePlayer();

  return (
    <div className="px-4 w-1/2" ref={containerRef}>
      <div className="hidden">
        <ReactPlayer
          controls={false}
          height={200}
          onEnded={handleEnded}
          onProgress={handleProgress}
          playing={playing}
          url={video?.uri}
          width={200}
        />
      </div>
      <div className="flex items-center justify-center mb-2">
        <Button
          aria-label="Previous video"
          className="mr-2"
          disabled={isPreviousDisabled}
          onClick={handlePrevious}
          title="Previous video"
        >
          <ArrowSmLeftIcon className="h-5 w-5" />
        </Button>
        <Button
          aria-label={playing ? 'Pause video' : 'Play video'}
          className="mr-2"
          disabled={isPlayPauseDisabled}
          onClick={handlePlayPause}
          title={playing ? 'Pause video' : 'Play video'}
        >
          {playing ? (
            <PauseIcon className="h-8 w-8" />
          ) : (
            <PlayIcon className="h-8 w-8" />
          )}
        </Button>
        <Button
          aria-label="Next video"
          disabled={isNextDisabled}
          onClick={handleNext}
          title="Next video"
        >
          <ArrowSmRightIcon className="h-5 w-5" />
        </Button>
      </div>
      {video !== undefined ? (
        <>
          <div className="flex items-center">
            <div className="mr-2 text-xs w-8">
              {formatSeconds(progress.playedSeconds)}
            </div>
            <div className="bg-neutral-100 h-1 w-full">
              <div
                className="bg-neutral-300 h-1"
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
        </>
      ) : (
        <div className="text-center">No videos for release</div>
      )}
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

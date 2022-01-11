import {
  ArrowSmLeftIcon,
  ArrowSmRightIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
} from "@heroicons/react/solid";
import ExternalLink from "~/components/ExternalLink";
import IconButton from "~/components/IconButton";
import { usePlayer } from "~/contexts/PlayerContext";
import useElementSize from "~/hooks/useElementSize";

export default function YouTubePlayer() {
  const [containerRef, { width: playerWidth }] = useElementSize();

  const {
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
    video,
    videos,
  } = usePlayer();

  return (
    <div className="px-4 w-1/2" ref={containerRef}>
      <div className="flex items-center justify-center mb-2 space-x-2">
        <IconButton
          aria-label="Previous video"
          disabled={isPreviousDisabled}
          onClick={handlePrevious}
          title="Previous video"
        >
          <ArrowSmLeftIcon className="h-5 w-5" />
        </IconButton>
        <IconButton
          aria-label="Skip backwards"
          disabled={isSkipBackwardDisabled}
          onClick={handleSkipBackward}
          title="Skip backwards"
        >
          <RewindIcon className="h-5 w-5" />
        </IconButton>
        <IconButton
          aria-label={playing ? "Pause video" : "Play video"}
          className="p-0"
          disabled={isPlayPauseDisabled}
          onClick={handlePlayPause}
          title={playing ? "Pause video" : "Play video"}
        >
          {playing ? (
            <PauseIcon className="h-10 w-10" />
          ) : (
            <PlayIcon className="h-10 w-10" />
          )}
        </IconButton>
        <IconButton
          aria-label="Skip forwards"
          disabled={isSkipForwardDisabled}
          onClick={handleSkipForward}
          title="Skip forwards"
        >
          <FastForwardIcon className="h-5 w-5" />
        </IconButton>
        <IconButton
          aria-label="Next video"
          disabled={isNextDisabled}
          onClick={handleNext}
          title="Next video"
        >
          <ArrowSmRightIcon className="h-5 w-5" />
        </IconButton>
      </div>
      {video !== undefined ? (
        <div>
          <div className="flex items-center">
            <div className="mr-2 text-xs w-8">
              {formatSeconds(progress.playedSeconds)}
            </div>
            <div className="bg-neutral-200 h-1 w-full">
              <div
                className="bg-neutral-300 h-1"
                style={{ width: `${progress.loaded * 100}%` }}
              >
                <div
                  className="bg-neutral-900 h-1"
                  style={{ width: `${progress.played * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="ml-2 text-xs w-8">
              {duration ? formatSeconds(duration) : "--:--"}
            </div>
          </div>
          <div
            className="mx-auto overflow-hidden text-center text-ellipsis text-sm whitespace-nowrap"
            style={{ width: playerWidth - 64 }}
          >
            <ExternalLink href={video.uri}>{video.title}</ExternalLink>
            <span>
              {" "}
              ({index + 1} / {videos.length})
            </span>
          </div>
        </div>
      ) : (
        <div className="flex h-9 items-center justify-center text-sm">
          <span>Nothing in queue</span>
        </div>
      )}
    </div>
  );
}

function formatSeconds(value: number) {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value - hours * 3600) / 60);
  const seconds = Math.round(value - hours * 3600 - minutes * 60);

  let formatted = "";
  formatted += hours > 0 ? hours.toString() + ":" : "";
  formatted += minutes.toString() + ":";
  formatted += seconds < 10 ? "0" : "";
  formatted += seconds.toString();

  return formatted;
}

import React from 'react';
import ReactPlayer from 'react-player/youtube';
import useElementSize from '~/hooks/useElementSize';

interface Video {
  title: string;
  description: string;
  duration: number;
  embed: boolean;
  uri: string;
}

interface YouTubePlayerProps {
  videos: Video[];
}

export default function YouTubePlayer({ videos }: YouTubePlayerProps) {
  const [playerRef, { width: playerWidth }] = useElementSize();

  const [index, setIndex] = React.useState(0);

  const [playing, setPlaying] = React.useState(false);

  return (
    <div ref={playerRef}>
      <ReactPlayer
        height={0}
        playing={playing}
        url={videos[index].uri}
        width={playerWidth}
      />
      <div className="flex items-center justify-center mb-2">
        <button
          className="mr-2"
          disabled={index === 0}
          onClick={() => {
            setIndex((prev) => (prev > 0 ? prev - 1 : 0));
          }}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <button
          aria-label={playing ? 'Pause' : 'Play'}
          className="mr-2"
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
          className=""
          disabled={index === videos.length - 1}
          onClick={() => {
            setIndex((prev) =>
              prev < videos.length - 1 ? prev + 1 : videos.length - 1
            );
          }}
        >
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="text-center text-sm">
        <h3
          className="overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ width: playerWidth }}
        >
          {videos[index].title}
        </h3>
        <p>
          {index + 1} / {videos.length}
        </p>
      </div>
    </div>
  );
}

interface IconProps {
  className?: string;
  d: string;
}

function Icon({ className, d }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path fillRule="evenodd" d={d} clipRule="evenodd" />
    </svg>
  );
}

type SpecificIconProps = Omit<IconProps, 'd'>;

const ArrowLeftIcon = ({ className }: SpecificIconProps) => (
  <Icon
    className={className}
    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
  />
);

const ArrowRightIcon = ({ className }: SpecificIconProps) => (
  <Icon
    className={className}
    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
  />
);

const PauseIcon = ({ className }: SpecificIconProps) => (
  <Icon
    className={className}
    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
  />
);

const PlayIcon = ({ className }: SpecificIconProps) => (
  <Icon
    className={className}
    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
  />
);

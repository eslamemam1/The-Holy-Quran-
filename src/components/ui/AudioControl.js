import { IconPause, IconPlay } from './Icons';

export default function AudioControl({ playing, onPlay, onPause, className = '' }) {
  return (
    <button
      type="button"
      onClick={playing ? onPause : onPlay}
      className={`audio-control-btn ${playing ? 'audio-control-btn--playing' : ''} ${className}`}
      aria-label={playing ? 'Pause audio' : 'Play audio'}
    >
      {playing ? (
        <IconPause className="h-5 w-5" />
      ) : (
        <IconPlay className="h-5 w-5" />
      )}
    </button>
  );
}

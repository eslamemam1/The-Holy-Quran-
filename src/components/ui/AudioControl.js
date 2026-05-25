import playIcon from '../../assets/images/play.png';
import stopIcon from '../../assets/images/stop.png';

export default function AudioControl({ playing, onPlay, onPause, className = '' }) {
  return (
    <button
      type="button"
      onClick={playing ? onPause : onPlay}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-quran-primary/10 transition-colors hover:bg-quran-primary/20 ${className}`}
      aria-label={playing ? 'Pause audio' : 'Play audio'}
    >
      <img
        src={playing ? stopIcon : playIcon}
        alt=""
        className="h-6 w-6"
      />
    </button>
  );
}

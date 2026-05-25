import { useState, useRef } from 'react';
import AudioControl from '../ui/AudioControl';

function Play(props) {
  const [audioofayah, setAudioofayah] = useState(false);
  const audioOfayah = useRef();

  const play = () => {
    audioOfayah.current?.play();
    setAudioofayah(true);
  };

  const pause = () => {
    audioOfayah.current?.pause();
    setAudioofayah(false);
  };

  const audioEnded = () => setAudioofayah(false);

  if (props.loading) return null;

  return (
    <div>
      <audio
        onEnded={audioEnded}
        src={props.quran.data.ayahs[props.id].audio.url}
        ref={audioOfayah}
        className="hidden"
      />
      <AudioControl
        playing={audioofayah}
        onPlay={play}
        onPause={pause}
      />
    </div>
  );
}

export default Play;

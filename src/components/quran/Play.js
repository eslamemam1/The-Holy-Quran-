import { useState, useRef } from 'react';
import AudioControl from '../ui/AudioControl';
import { getAyahAudioUrl } from '../../i18n/content';

function Play(props) {
  const [audioofayah, setAudioofayah] = useState(false);
  const audioOfayah = useRef();
  const ayah = props.quran?.data?.ayahs?.[props.id];
  const audioSrc = getAyahAudioUrl(ayah);

  const play = () => {
    audioOfayah.current?.play();
    setAudioofayah(true);
  };

  const pause = () => {
    audioOfayah.current?.pause();
    setAudioofayah(false);
  };

  const audioEnded = () => setAudioofayah(false);

  if (props.loading || !audioSrc) return null;

  return (
    <div>
      <audio
        onEnded={audioEnded}
        src={audioSrc}
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

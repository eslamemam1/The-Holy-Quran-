/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import playbutton from "./play.png"
import stopbutton from "./stop.png"
import { useState,useRef  } from 'react';
function Play(props) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
  const [audioofayah, setAudioofayah] = useState(false); 
  const audioOfayah = useRef();
  // eslint-disable-next-line no-lone-blocks, no-unused-expressions, array-callback-return
  { props.loading ? "Londing....." : props.quran.data.ayahs[props.id].audio.url }
    const play = ()=> {
    audioOfayah.current.play();
      setAudioofayah(true);
  }
  const pause = () => {
    audioOfayah.current.pause();
    setAudioofayah(false);
  }

  let audioEnded = () => {
    setAudioofayah(false);
  }

  return (
    <div > 
        <audio onEnded={audioEnded} src={(props.loading ? "Londing....." : props.quran.data.ayahs[props.id].audio.url)} ref={audioOfayah} />
              {audioofayah ? <button className=' mr-2 w-7 h-7' ><img src={stopbutton} onClick={pause} /></button>
            : <button className=' mr-2 w-7 h-7'><img src={playbutton} onClick={play} /></button>}
         </div>
  )
}

export default Play
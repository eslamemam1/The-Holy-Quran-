/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/img-redundant-alt */
import image from './473.png'
import numberAyah from './ayahNumber.png'
import playbutton from "./play.png"
import stopbutton from "./stop.png"
import { useState, useRef } from 'react'
import Play from './Play'
const Surah = (props) => {

  // eslint-disable-next-line no-lone-blocks, no-unused-expressions
  const [playing, setPLaying] = useState(false);

  const curentAudio = useRef();
  // eslint-disable-next-line use-isnan
  if (props.loading ? "Londing....." : props.quran.data.recitation.full === undefined)
  {
    props.setCounter(1)
  }
  (props.loading ? "Londing....." : props.quran.data.recitation.full)
  const play = () => {
    curentAudio.current.play();
    setPLaying(true);
  }
  const pause = () => {
    curentAudio.current.pause();
      setPLaying(false);
  }
  return (
    <div className=' bg mt-[-11px]'>
     <div className=' container w-[80%] m-auto'>
      <div className='theName font flex justify-center text-lg sm:text-2xl text-center p-2 w-2/4 m-auto mt-3 mb-3'>
          <div className='' >
            <p className=''>
            {props.loading ? "Londing....." : props.quran.data.asma.ar.long}
          </p>
          </div>
        <div>
          <audio src={(props.loading ? "Londing....." : props.quran.data.recitation.full)} ref={curentAudio} />
          {playing ? <button className=' ml-2 w-7 h-7' ><img src={stopbutton} onClick={pause} /></button>
            : <button className=' ml-2 w-7 h-7'><img src={playbutton} onClick={play} /></button>}
        </div>
      </div>
      <div className=' flex justify-center '>
        <div>
          <img src={image} alt="" className='besmellah w-[65%] mb-2 m-auto'  />
        </div>
      </div>
      <div>
      {props.loading === false &&  console.log(props.quran)}
      </div>
      {
        props.loading === false && props.quran.data.ayahs.map((ayahs,id) => {
          return (
            <div key={id}>
              <div className='ayahs font flex justify-between mt-2 text-lg sm:text-2xl'>
                <div className=''>
                  <Play className='' quran={props.quran} loading={props.loading} id={id} />
                </div>
                <div className=' flex'>
                <div className=' flex w-14 justify-center '>
                  <img src={numberAyah} alt="" className='w-7 h-10 relative ' />
                  <p className='text-xs mt-3 absolute' >{(id + 1).toLocaleString('ar-u-nu-arab')}</p>
                </div>
                  <div>
                    {ayahs.text.ar}
                  </div>
                </div>
              </div>
              <div className=' mt-1'>
                <div>
                  <p className=' font-light'>
                 - translation
                  </p>
                  <p className=' text-base sm:text-xl'>
                  {ayahs.text.read}
                  </p>
                </div>
                <div>
                  <p className=' font-light'>
                 - tafsir 
                  </p>
                  <p className=' text-base sm:text-xl mb-5'>
                   {ayahs.translation.en}
                  </p>
                </div>
              </div>
              <hr className=' border-black'></hr>
            </div>
              )
      })
      }
      {props.error ? props.error : null}
      <div className=' flex justify-evenly h-14 mt-4 mb-4'>
        <button className=' border rounded-md text-xl p-2 text-white bg-[#14203f]' onClick={props.Previous}> Previous Surah </button>
        <button className=' border rounded-md text-xl p-2 text-white bg-[#14203f]' onClick={props.next}> Next Surah</button>
      </div>
    </div>
    </div>
  )
}
export default Surah
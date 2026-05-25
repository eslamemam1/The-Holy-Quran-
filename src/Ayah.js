/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-expressions */
import { useState,useRef } from 'react';
import numberAyah from './ayahNumber.png'
import playbutton2 from "./play.png"
import stopbutton2 from "./stop.png"
function ayah(props) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [counterforaya, setCounter] = useState(0);
  const nextAyah = () => {
    setCounter(counterforaya + 1);
    if (props.loading ? "Londing....." : props.quran.data.ayahs.length - 1 <= counterforaya)
    {
      setCounter(0);
    }
  }
  const previousAyah = () => {
    setCounter(counterforaya - 1);
    if (counterforaya === 0)
    {
      setCounter(0);
    }
  }
  const [playing, setPLaying] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const curentAudio = useRef();
  (props.loading ? "Londing....." : props.quran.data.recitation.full)
  const play = () => {
    curentAudio.current.play();
    setPLaying(true);
  }
  const pause = () => {
    curentAudio.current.pause();
    setPLaying(false);
  }

  let e = () => {
    setPLaying(false)
  }

 // let rev = document.getElementById('rev');
 // let next = document.getElementById('next');

  let revf = ()=> {
    setCounter(0);
  }
  let nextf = ()=> {
    setCounter(0);
  }

 // const rev1 = useRef();
  //const next1 = useRef();
  //const rev = rev1.current;
  //const next = next1.current;

  //props.loading ? "Londing....." :rev.addEventListener('click', revf);
  //props.loading ? "Londing....." :next.addEventListener('click', nextf);

  return (
    <div className=' bg h-[91vh]'>
    <div className=' container w-4/5 pt-10 m-auto'>
      <div className='flex justify-between mt-2 mb-2'>
          <button id='rev' className=' rounded-md font-semibold text-xl p-2 text-white bg-[#151f64]' onClick={() => {[ props.Previous(), revf()] }}>السورة السابقة</button>
          <button id='next' className=' rounded-md font-semibold text-xl p-2 text-white bg-[#151f64]' onClick={() => { [props.next(), nextf()] }}>السورة التالية</button>
        </div>
              <div className='flex justify-between mt-10 '>
      <button className=' rounded-md font-semibold text-xl p-2 text-white bg-[#151f64]' onClick={previousAyah}>Previous Ayah</button>
      <button className=' rounded-md font-semibold text-xl p-2 text-white bg-[#151f64]' onClick={nextAyah}>Next Ayah</button>
      </div>
      <div className=' text-center font-semibold text-2xl'>
      <h1 className=' m-5 font'>
        {props.loading === false && props.quran.data.asma.ar.long}
        </h1>
        {/* ayah */}
        {props.loading === false && console.log(counterforaya)}
        {props.loading === false && console.log(props.quran.data.ayahs.length-1)}
        <div className=' flex justify-between'>
            <div>
          <audio onEnded={e} src={(props.loading ? "Londing....." : props.quran.data.ayahs[counterforaya].audio.url)} ref={curentAudio} />
          {playing ? <button className=' ml-2 w-7 h-7' ><img src={stopbutton2} onClick={pause} /></button>
            : <button className=' ml-2 w-7 h-7'><img src={playbutton2} onClick={play} /></button>}
        </div>
          <div className=' flex justify-around'>
            <div className='relative w-7 h-10 mr-2'>
            <img src={numberAyah} alt="" className='w-7 h-10 absolute  ' />
            <p className=' absolute text-center w-7 h-10 text-sm mt-2'>{(counterforaya + 1).toLocaleString('ar-u-nu-arab')}</p>
          </div>
          <div>
          <h1 className='font'>
        {props.loading === false && props.quran.data.ayahs[`${counterforaya}`].text.ar}
        </h1>
          </div>
          </div>
        </div>
        <div className=' pt-5'>
          <div className=' flex flex-col items-start'>
            <p className=' font-light sm:text-xl'>
            -translation
            </p>
            <p className=' text-base sm:text-xl'>
              {props.loading === false && props.quran.data.ayahs[counterforaya].text.read}
            </p>
          </div>
          <div className='flex flex-col items-start'>
            <p className=' font-light sm:text-x'>
            -tafsir
            </p>
            <p className=' text-base sm:text-x'>
              {props.loading === false && props.quran.data.ayahs[counterforaya].translation.en}
              {props.loading === false && console.log(props.quran.data.ayahs[counterforaya].audio.url)}
            </p>
          </div>
        </div>
        </div>
      </div>
      
    </div>
  )
}

export default ayah
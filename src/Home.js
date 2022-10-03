/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/style-prop-object */
import React from 'react'
import { useEffect,useState } from 'react';
import axios from 'axios';
import {  Link  } from "react-router-dom";
import qurankareem from './qurankareem.png'
function Home(props) {
    const [loading, setLoading] = useState(true);
    const [error , setError] = useState("");
    const [quran, setQuran] = useState([]);
      useEffect(() => {
    axios.get(`https://quran-endpoint.vercel.app/quran/`)
      .then((response) => {
        setLoading(false);
        setError("");
        setQuran(response.data);
      }).catch((error) => {
        setLoading(false);
        setError("SOMTHING WONT RONG");
        setQuran([]);
      })
      }, []);  
  const x = (e) => {
    // eslint-disable-next-line use-isnan
    if (parseInt(e.target.attributes[1].value) === NaN)
    {
      props.x(1)
    }
    else
    {
      console.log(parseInt(e.target.attributes[1].value))
      props.x(parseInt(e.target.attributes[1].value))
      //console.log(linkofsorah.getAttributeNode)
    }
  }
  //let linkofsorah = document.getElementsByClassName('linkofsorah');
  
  return (
    <div className=' w-full h-full '>
      <div className=' paner1 w-full h-[500px] flex justify-center items-center bg-[#151f64] mb-14 '>
      <div className=' flex justify-center'>
          <img className='paner' src={qurankareem} alt='s'/>
      </div>
      </div>
      <div className=' container w-10/12 mb-10 m-auto '>
      <p className=' font-semibold text-xl '> Surah </p>
      <hr></hr>
      </div>
    <div className=' grid lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2 gap-3 main w-10/12 m-auto '  >
      {error ? error : null}
      {loading ? "Londing....." : quran.data.map((name , id) => {
        return (
         <Link className='linkofsorah' to="/surah" key={id} onClick={x} >
            <div title="Please click on the number" className='viewnameOFsourah pointer-events-auto hover:text-white hover:bg-[#151f64]
           text-slate-800  border border-1 rounded-md w-70 h-16 flex justify-between items-center m-auto ' numberofsurah={id + 1}>
              <div className=' pl-5 flex items-center w-2/4' numberofsurah={id + 1}>
              <div className=' numberOfsurah border rounded-sm w-10 h-10 mr-3 rotate-6' numberofsurah={id + 1}>
                <p className=' text-base font-bold text-center mt-1' numberofsurah={id + 1}>
                  {id + 1}
              </p>
              </div>
              <div className='nameOfsorah'>
                <p className='text-center text-base font-bold ' numberofsurah={id + 1}  nameofsurah={name.asma.en.long}>
                    {name.asma.en.short}
                  </p>
                  <p className='translationOFsurah text-center text-sm font-semibold text-gray-500 ' numberofsurah={id + 1}>
                    {name.asma.translation.en}
                  </p>
              </div>
              </div>
              <div className='  w-2/4 flex flex-col items-end ' numberofsurah={id + 1} arnameofsorah={name.asma.ar.short}  numbersofayah={name.ayahCount}>
                  <p className=' mr-5 arnameOFsorah text-center text-base font-semibold' numberofsurah={id + 1}>{name.asma.ar.long}</p>
                  <p className=' mr-6 numbersOFsorah text-sm text-center font-semibold text-gray-500 ' numberofsurah={id + 1}>ayahs {name.ayahCount}</p>
              </div>
            </div>
            </Link>
        )
      } )}
      </div>
      <div className=' container w-10/12 mt-5  m-auto  '>
        <hr></hr>
        <div className='flex flex-col h-14 items-start'>
          <p className=' font-semibold '> © 2022 Quran kareem. All Rights Reserved . </p>
          <p className=' font-semibold '> © Preparing Eslam Emam .</p>
        </div>
      </div> 
    </div>
  )
}

export default Home
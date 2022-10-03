/* eslint-disable use-isnan */
import './App.css';
import React  from 'react';
import Surah from './Surah';
import Ayah from './Ayah';
import Home from './Home';
import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import icon from './icon.png'
import axios from 'axios';
function App() {
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  
  const [quran, setQuran] = useState([]);
  
  const [counter, setCounter] = useState(1);


  useEffect(() => {
    axios.get(`https://quran-endpoint.vercel.app/quran/${ counter }`)
      .then((response) => {
        setLoading(false);
        setError("");
        setQuran(response.data);
      }).catch((error) => {
        setLoading(false);
        setError("SOMTHING WONT RONG");
        setQuran([]);
      })
  }, [ counter]);  
  
  const next = () => {
    setCounter(counter + 1)
    if (counter === 114)
      {
        setCounter(114);
      }
  }

    const Previous = () => {
      setCounter(counter - 1)
      if (counter === 1)
      {
        setCounter(1);
      }
    }
  console.log(counter)
  if (counter === NaN)
  {
    setCounter(1);
  }

  return (
    <div className="App">
      <nav className='navpar flex justify-around items-center w-4/5 h-14 container m-auto'>
        <div className=' flex grow items-center'>
          <img src={icon} alt='ss' className=' w-9 h-7' />
          <p className='text-xs sm:text-lg font-semibold  '> Quran kareem </p>
        </div>
        <Link className='flex-none rounded-md p-1 hover:text-white hover:bg-[#151f64] text-xs sm:text-lg font-semibold ' to="/">Home</Link>
        <Link className='flex-none rounded-md p-1 hover:text-white hover:bg-[#151f64] text-xs sm:text-lg font-semibold' to="/surah">Surah</Link>
        <Link className='flex-none rounded-md p-1 hover:text-white hover:bg-[#151f64] text-xs sm:text-lg font-semibold ' to="/ayah">Ayah</Link>
      </nav>
      <hr className=' shadow-sm'></hr>
      <Routes>
        <Route path="/" element={<Home x={setCounter} loading={loading} error={error} quran={quran} counter={ counter }/>} />
        <Route path="/surah" element={<Surah Previous={Previous} next= {next} loading={loading} error={error} quran={quran} counter={ counter } setCounter={setCounter}/>}  />
        <Route path="/ayah" element={<Ayah Previous={Previous} next={next} loading={loading} error={error} quran={quran} counter={counter} setCounter={setCounter} />} />
      </Routes>
    </div>
  );
}

export default App;

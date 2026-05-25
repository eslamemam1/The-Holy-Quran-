import { useState, useRef } from 'react';
import numberAyah from './ayahNumber.png';
import LoadingSpinner from './components/LoadingSpinner';
import AudioControl from './components/AudioControl';

function Ayah(props) {
  const [counterforaya, setCounter] = useState(0);
  const [playing, setPlaying] = useState(false);
  const currentAudio = useRef();

  const ayahCount = props.quran?.data?.ayahs?.length ?? 0;

  const nextAyah = () => {
    setCounter((c) => (c < ayahCount - 1 ? c + 1 : 0));
  };

  const previousAyah = () => {
    setCounter((c) => (c > 0 ? c - 1 : 0));
  };

  const play = () => {
    currentAudio.current?.play();
    setPlaying(true);
  };

  const pause = () => {
    currentAudio.current?.pause();
    setPlaying(false);
  };

  const onAudioEnded = () => setPlaying(false);

  const resetAyah = () => setCounter(0);

  if (props.loading) {
    return (
      <div className="bg min-h-[60vh]">
        <LoadingSpinner label="Loading ayah..." />
      </div>
    );
  }

  const { data } = props.quran;
  const currentAyah = data.ayahs[counterforaya];

  return (
    <div className="bg min-h-[70vh] pb-12">
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2 sm:justify-between">
          <button
            type="button"
            className="btn-primary font-arabic text-base"
            onClick={() => {
              props.Previous();
              resetAyah();
            }}
            disabled={props.counter <= 1}
          >
            السورة السابقة
          </button>
          <button
            type="button"
            className="btn-primary font-arabic text-base"
            onClick={() => {
              props.next();
              resetAyah();
            }}
            disabled={props.counter >= 114}
          >
            السورة التالية
          </button>
        </div>

        <div className="ayah-card mb-6 text-center">
          <p className="section-label mb-1">
            Surah {props.counter} · Ayah {counterforaya + 1} of {ayahCount}
          </p>
          <h1 className="arabic-text text-3xl">{data.asma.ar.long}</h1>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn-outline" onClick={previousAyah}>
            ← Previous Ayah
          </button>
          <button type="button" className="btn-outline" onClick={nextAyah}>
            Next Ayah →
          </button>
        </div>

        <article className="ayah-card">
          <div className="mb-6 flex items-start justify-between gap-4">
            <AudioControl playing={playing} onPlay={play} onPause={pause} />
            <audio
              onEnded={onAudioEnded}
              src={currentAyah.audio.url}
              ref={currentAudio}
              className="hidden"
            />
            <div className="flex flex-1 flex-row-reverse items-start gap-3">
              <div className="relative shrink-0">
                <img
                  src={numberAyah}
                  alt=""
                  className="h-10 w-8"
                  aria-hidden
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-quran-primary">
                  {(counterforaya + 1).toLocaleString('ar-u-nu-arab')}
                </span>
              </div>
              <p className="arabic-text flex-1 text-3xl sm:text-4xl leading-loose">
                {currentAyah.text.ar}
              </p>
            </div>
          </div>

          <div className="space-y-5 border-t border-slate-100 pt-5">
            <div>
              <p className="section-label mb-2">Translation</p>
              <p className="text-lg leading-relaxed text-slate-700">
                {currentAyah.text.read}
              </p>
            </div>
            <div>
              <p className="section-label mb-2">Tafsir</p>
              <p className="text-lg leading-relaxed text-slate-600">
                {currentAyah.translation.en}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default Ayah;

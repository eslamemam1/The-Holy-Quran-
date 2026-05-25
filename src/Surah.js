import image from './473.png';
import numberAyah from './ayahNumber.png';
import { useState, useRef } from 'react';
import Play from './Play';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBanner from './components/ErrorBanner';
import AudioControl from './components/AudioControl';

const Surah = (props) => {
  const [playing, setPlaying] = useState(false);
  const currentAudio = useRef();

  if (
    !props.loading &&
    props.quran?.data?.recitation?.full === undefined
  ) {
    props.setCounter(1);
  }

  const play = () => {
    currentAudio.current?.play();
    setPlaying(true);
  };

  const pause = () => {
    currentAudio.current?.pause();
    setPlaying(false);
  };

  if (props.loading) {
    return (
      <div className="bg min-h-[60vh]">
        <LoadingSpinner label="Loading surah..." />
      </div>
    );
  }

  const { data } = props.quran;

  return (
    <div className="bg pb-12">
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <div className="ayah-card mb-8 text-center">
          <p className="section-label mb-2">Surah {props.counter}</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <h1 className="arabic-text text-3xl sm:text-4xl">
              {data.asma.ar.long}
            </h1>
            <AudioControl playing={playing} onPlay={play} onPause={pause} />
            <audio src={data.recitation.full} ref={currentAudio} className="hidden" />
          </div>
          <p className="mt-2 text-lg font-semibold text-quran-muted">
            {data.asma.en.long} · {data.asma.translation.en}
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <img
            src={image}
            alt="Bismillah"
            className="mx-auto max-w-xs opacity-90 sm:max-w-sm"
          />
        </div>

        <ErrorBanner message={props.error} />

        <div className="space-y-6">
          {data.ayahs.map((ayahs, id) => (
            <article key={id} className="ayah-card">
              <div className="mb-4 flex items-start justify-between gap-4">
                <Play quran={props.quran} loading={props.loading} id={id} />
                <div className="flex flex-1 flex-row-reverse items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={numberAyah}
                      alt=""
                      className="h-10 w-8 object-contain"
                      aria-hidden
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-quran-primary">
                      {(id + 1).toLocaleString('ar-u-nu-arab')}
                    </span>
                  </div>
                  <p className="arabic-text flex-1 text-2xl sm:text-3xl">
                    {ayahs.text.ar}
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-4">
                <div>
                  <p className="section-label mb-1">Translation</p>
                  <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
                    {ayahs.text.read}
                  </p>
                </div>
                <div>
                  <p className="section-label mb-1">Tafsir</p>
                  <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
                    {ayahs.translation.en}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="btn-outline"
            onClick={props.Previous}
            disabled={props.counter <= 1}
          >
            ← Previous Surah
          </button>
          <button type="button" className="btn-primary" onClick={props.next} disabled={props.counter >= 114}>
            Next Surah →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Surah;

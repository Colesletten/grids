import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { PLATES, byId, indexOf, num } from './plates';
import {
  MASTERY,
  getQueue,
  pickReview,
  record,
  resetAll,
  setQueue,
  toggleGrid,
  useStore,
} from './store';
import { StageCtx } from './Stage';
import { EXERCISES } from './ex';

/* ---------- routing: the hash is the page number ---------- */

type Route = { name: 'contents' | 'plate' | 'canon'; id?: string; key: string; depth: number };

function parse(hash: string): Route {
  const a = hash.replace(/^#\/?/, '');
  if (byId(a)) return { name: 'plate', id: a, key: a, depth: indexOf(a) + 1 };
  if (a === 'record') return { name: 'canon', key: 'record', depth: 99 };
  return { name: 'contents', key: 'contents', depth: 0 };
}
const subscribeHash = (f: () => void) => {
  window.addEventListener('hashchange', f);
  return () => window.removeEventListener('hashchange', f);
};
export const go = (path: string) => {
  window.location.hash = path;
};

function useMedia(q: string) {
  return useSyncExternalStore(
    (f) => {
      const m = window.matchMedia(q);
      m.addEventListener('change', f);
      return () => m.removeEventListener('change', f);
    },
    () => window.matchMedia(q).matches,
  );
}

const EASE = [0.7, 0, 0.2, 1] as const;
const OPEN = 'inset(0% 0% 0% 0%)';
const SHUT = 'inset(0% 0% 0% 100%)';

/* A page arrives like a turned leaf: wiped in from the fore-edge. */
const pageV = {
  enter: (d: number) => ({ clipPath: d > 0 ? SHUT : OPEN }),
  center: { clipPath: OPEN, transition: { duration: 0.7, ease: EASE } },
  exit: (d: number) => ({
    clipPath: d > 0 ? OPEN : SHUT,
    transition: { duration: 0.7, ease: EASE },
  }),
};
const innerV = {
  enter: (d: number) => ({ x: d > 0 ? 56 : 0 }),
  center: { x: 0, transition: { duration: 0.7, ease: EASE } },
  exit: { x: 0 },
};

export default function App() {
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash);
  const route = parse(hash);
  const { grid } = useStore();
  const last = useRef({ key: route.key, depth: route.depth, dir: 1 });
  if (last.current.key !== route.key) {
    last.current = {
      key: route.key,
      depth: route.depth,
      dir: route.depth >= last.current.depth ? 1 : -1,
    };
  }
  const dir = last.current.dir;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'g' && !e.metaKey && !e.ctrlKey) toggleGrid();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence initial={false} custom={dir}>
        <motion.main
          key={route.key}
          className={`page ${route.name === 'contents' ? 'black' : ''}`}
          style={{ zIndex: route.depth }}
          custom={dir}
          variants={pageV}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <motion.div className="page-in" custom={dir} variants={innerV}>
            {route.name === 'contents' && <Contents />}
            {route.name === 'plate' && <Plate id={route.id!} />}
            {route.name === 'canon' && <Canon />}
          </motion.div>
        </motion.main>
      </AnimatePresence>
      {grid && <GridOverlay />}
    </MotionConfig>
  );
}

function GridOverlay() {
  return (
    <div className="overlay g" aria-hidden>
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

function GridBtn() {
  const { grid } = useStore();
  return (
    <button className="link b" onClick={toggleGrid} aria-pressed={grid}>
      {grid ? 'Hide grid' : 'Grid'}
    </button>
  );
}

/* ---------- contents ---------- */

function Contents() {
  const { scores } = useStore();
  const mastered = PLATES.filter((p) => (scores[p.id]?.best ?? 0) >= MASTERY).length;
  const started = Object.keys(scores).length;

  const review = () => {
    const q = pickReview(PLATES.map((p) => p.id));
    setQueue(q);
    go(`${q[0]}`);
  };
  const resume = () => {
    setQueue([]);
    const next = PLATES.find((p) => (scores[p.id]?.best ?? 0) < MASTERY) ?? PLATES[0];
    go(`${next.id}`);
  };

  const part = (n: 1 | 2, name: string) => (
    <section className="part">
      <h2 className="b part-label">
        Part {n === 1 ? 'One' : 'Two'}
        <br />
        {name}
      </h2>
      <ol className="list">
        {PLATES.map((p, i) =>
          p.part !== n ? null : (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.012, duration: 0.4 }}
            >
              <button
                className="row b"
                onClick={() => {
                  setQueue([]);
                  go(`${p.id}`);
                }}
              >
                <span className="row-n">{num(i)}</span>
                <span className="row-t">{p.title}</span>
                <span className="row-s">{scores[p.id] ? scores[p.id].best : ''}</span>
                <span
                  className={`mark ${
                    !scores[p.id] ? '' : scores[p.id].best >= MASTERY ? 'full' : 'half'
                  }`}
                />
              </button>
            </motion.li>
          ),
        )}
      </ol>
    </section>
  );

  return (
    <div className="contents scroll">
      <div className="spine b" aria-hidden>
        THE VIGNELLI CANON
      </div>
      <header className="masthead">
        <h1 className="b part-label">
          The Vignelli Canon
          <br />A Workbook
        </h1>
        <div className="mast-text">
          <p className="s">
            Thirty plates, one for each chapter of Massimo Vignelli’s book. Read the principle,
            practise it with your hands, compare your answer with the canon.
          </p>
          <p className="b mast-count">
            {mastered} of {PLATES.length} plates mastered
          </p>
          <nav className="mast-nav">
            <button className="btn b invert" onClick={resume}>
              {started ? 'Continue' : 'Begin'}
            </button>
            <button className="link b" onClick={review}>
              Review five
            </button>
            <button className="link b" onClick={() => go('record')}>
              Your Canon
            </button>
            <GridBtn />
          </nav>
        </div>
      </header>
      <div className="parts">
        {part(1, 'The Intangibles')}
        {part(2, 'The Tangibles')}
      </div>
      <footer className="colophon s">
        An unofficial study companion to <i>The Vignelli Canon</i> by Massimo Vignelli. Principles
        are summarised; every diagram is drawn for this workbook. A filled square marks a plate
        mastered at {MASTERY} or above.
      </footer>
    </div>
  );
}

/* ---------- plate ---------- */

function Plate({ id }: { id: string }) {
  const p = byId(id)!;
  const i = indexOf(id);
  const wide = useMedia('(min-width: 900px) and (min-aspect-ratio: 1/1)');
  const tall = useMedia('(min-width: 600px) and (min-height: 900px)') && !wide;
  const paged = !wide && !tall; // the phone turns pages; larger sheets show both at once
  const queue = getQueue();
  const qi = queue.indexOf(id);
  const inReview = qi >= 0;
  const [practising, setPractising] = useState(inReview);
  const [run, setRun] = useState(0);
  const [done, setDone] = useState<{ score: number; note?: string } | null>(null);
  const { scores } = useStore();
  const Exercise = EXERCISES[id];

  const nextId = inReview ? queue[qi + 1] : PLATES[i + 1]?.id;
  const next = () => (nextId ? go(`${nextId}`) : go(inReview ? '' : 'record'));
  const again = () => {
    setDone(null);
    setRun(run + 1);
  };
  const finish = (score: number, note?: string) => {
    setDone({ score, note });
    record(id, score);
  };

  const result = done && (
    <div className="result rise">
      <div className="result-score">
        <span className="d">{done.score}</span>
        <span className="b">
          Precision
          <br />
          {done.score >= MASTERY ? 'Mastered' : 'Not yet'}
        </span>
      </div>
      <p className="s">
        {done.note ? `${done.note} ` : ''}
        {p.proof}
      </p>
      <div className="why-btns">
        <button className="btn b plain" onClick={again}>
          Again
        </button>
        <button className="btn b primary" onClick={next}>
          {nextId ? 'Next plate' : inReview ? 'Contents' : 'Your Canon'}
        </button>
      </div>
    </div>
  );

  const bar = (
    <div className="bar b">
      <button
        className="link b"
        onClick={() => (practising && paged && !inReview ? setPractising(false) : go(''))}
      >
        {practising && paged && !inReview ? '← Principle' : '← Contents'}
      </button>
      <span className="bar-mid">
        {inReview ? `Review ${qi + 1} / ${queue.length}` : `${num(i)} / ${PLATES.length}`}
      </span>
      <GridBtn />
    </div>
  );

  const read = (
    <div className="read scroll">
      <div className="read-label">
        <h1 className="b">{p.title}</h1>
        <span className="b read-n">{num(i)}</span>
      </div>
      <div className="read-text">
        {p.principle.map((t, k) => (
          <p className="s" key={k}>
            {t}
          </p>
        ))}
        <p className="s quote">“{p.quote}”</p>
        {scores[id] && (
          <p className="b read-best">
            Best {scores[id].best} · attempts {scores[id].n}
          </p>
        )}
        {paged && (
          <button className="btn b primary read-go" onClick={() => setPractising(true)}>
            Practice
          </button>
        )}
      </div>
    </div>
  );

  const stage = (
    <StageCtx.Provider value={{ finish, done: !!done, result }}>
      <div className="stage">
        <Exercise key={run} />
      </div>
    </StageCtx.Provider>
  );

  const cover = (
    <div className="cover">
      <span className="cover-n b">{num(i)}</span>
      <button className="btn b primary" onClick={() => setPractising(true)}>
        Begin practice
      </button>
    </div>
  );

  return (
    <div className={`plate ${wide ? 'wide' : tall ? 'tall' : 'narrow'}`}>
      {bar}
      {!paged ? (
        <div className="spread">
          <div className="left">{read}</div>
          <div className="right">
            <AnimatePresence initial={false}>
              {practising ? (
                <Pane key="stage">{stage}</Pane>
              ) : (
                <motion.div key="cover" className="pane" exit={{ opacity: 1 }}>
                  {cover}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="single">
          <div className="pane">{read}</div>
          <AnimatePresence initial={false}>
            {practising && <Pane key="stage">{stage}</Pane>}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function Pane({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="pane top"
      initial={{ clipPath: SHUT }}
      animate={{ clipPath: OPEN }}
      exit={{ clipPath: SHUT }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- your canon: the record, set as a poster ---------- */

function Canon() {
  const { scores } = useStore();
  const [confirm, setConfirm] = useState(false);
  const total = Math.round(
    PLATES.reduce((a, p) => a + (scores[p.id]?.best ?? 0), 0) / PLATES.length,
  );
  const mastered = PLATES.filter((p) => (scores[p.id]?.best ?? 0) >= MASTERY).length;
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="plate canon-page">
      <div className="bar b">
        <button className="link b" onClick={() => go('')}>
          ← Contents
        </button>
        <span className="bar-mid">Your Canon</span>
        <GridBtn />
      </div>
      <div className="canon-wrap">
        <div className="fit">
          <div
            className="fit-in poster"
            style={{ width: 'min(100cqw, 70.7cqh)', height: 'min(100cqh, 141.4cqw)' }}
          >
            <div className="poster-head">
              <span>The Vignelli Canon</span>
              <span>Workbook record</span>
            </div>
            <div className="poster-fig">
              <span className="poster-num">{total}</span>
              <span className="poster-cap">
                Precision
                <br />
                {mastered} of {PLATES.length} mastered
                <br />
                {date}
              </span>
            </div>
            <div className="poster-grid">
              {PLATES.map((p, i) => {
                const s = scores[p.id]?.best ?? 0;
                return (
                  <button key={p.id} className="cell" onClick={() => go(`${p.id}`)}>
                    <span className="cell-sq">
                      <motion.span
                        className={s >= MASTERY ? 'fill full' : 'fill'}
                        initial={{ height: 0 }}
                        animate={{ height: `${s}%` }}
                        transition={{ delay: 0.5 + i * 0.025, duration: 0.6, ease: EASE }}
                      />
                    </span>
                    <span className="cell-t">
                      {num(i)} {p.title}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="poster-quote">“I love systems and despise happenstance.”</p>
          </div>
        </div>
      </div>
      <div className="canon-foot">
        {confirm ? (
          <>
            <span className="s">Erase every score?</span>
            <button
              className="btn b primary"
              onClick={() => {
                resetAll();
                setConfirm(false);
              }}
            >
              Erase
            </button>
            <button className="btn b plain" onClick={() => setConfirm(false)}>
              Keep
            </button>
          </>
        ) : (
          <button className="link b" onClick={() => setConfirm(true)}>
            Reset record
          </button>
        )}
      </div>
    </div>
  );
}

import { useRef, useState, type CSSProperties } from 'react';
import { Btn, Fit, Task, Why, shuffle, useStage } from '../Stage';
import { Choose } from '../engines/Choose';
import { Sort } from '../engines/Sort';
import { Dial } from '../engines/Dial';
import { Place, type Pos } from '../engines/Place';

const css = (o: Record<string, string | number>) => o as CSSProperties;

/* ---------- 01 Semantics: strip what carries no meaning ---------- */

const SEM = [
  { id: 'title', keep: true },
  { id: 'work', keep: true },
  { id: 'strings', keep: true },
  { id: 'when', keep: true },
  { id: 'where', keep: true },
  { id: 'stripes', keep: false },
  { id: 'burst', keep: false },
  { id: 'swash', keep: false },
  { id: 'confetti', keep: false },
  { id: 'ornament', keep: false },
];

export function Semantics() {
  const { finish, done } = useStage();
  const [off, setOff] = useState<string[]>([]);
  const toggle = (id: string) =>
    !done && setOff(off.includes(id) ? off.filter((x) => x !== id) : [...off, id]);
  const check = () => {
    const good = SEM.filter((e) => !e.keep && off.includes(e.id)).length;
    const bad = SEM.filter((e) => e.keep && off.includes(e.id)).length;
    const score = Math.max(0, Math.round(((good - bad) / 5) * 100));
    finish(
      score,
      bad ? 'You removed something the reader needs.' : good < 5 ? 'Some decoration survived.' : '',
    );
    window.setTimeout(() => setOff(SEM.filter((e) => !e.keep).map((e) => e.id)), 900);
  };
  const el = (id: string, children: React.ReactNode) => (
    <button
      className={`sem sem-${id} ${off.includes(id) ? 'off' : ''}`}
      onClick={() => toggle(id)}
      aria-label={id}
    >
      {children}
    </button>
  );
  return (
    <Task
      instruction="A poster for a string quartet. Tap away everything that carries no meaning."
      foot={
        <Why text="Tap an element to remove it, tap its ghost to bring it back.">
          <Btn onClick={check}>Done</Btn>
        </Why>
      }
    >
      <Fit r={0.707} className="sheet">
        {el('stripes', <i />)}
        {el('confetti', <><i /><i /><i /><i /><i /></>)}
        {el('title', <>String<br />Quartet</>)}
        {el('work', <>Beethoven, Op. 131</>)}
        {el('strings', <><i /><i /><i /><i /></>)}
        {el(
          'swash',
          <svg viewBox="0 0 100 30" preserveAspectRatio="none">
            <path d="M0 22 C 20 -8, 45 40, 68 10 S 92 4, 100 16" />
          </svg>,
        )}
        {el('burst', <span>Live!</span>)}
        {el('when', <>12 March, 20.00</>)}
        {el('where', <>Sala Verdi, Milano</>)}
        {el('ornament', <i />)}
      </Fit>
    </Task>
  );
}

/* ---------- 02 Syntactics: find the element out of system ---------- */

type El = { c: number; r: number; w: number; h: number; k: 'text' | 'pic' | 'head'; flaw?: CSSProperties };
const SYN: { els: El[]; why: string }[] = [
  {
    els: [
      { c: 0, r: 0, w: 4, h: 1, k: 'head' },
      { c: 0, r: 1, w: 1, h: 4, k: 'text' },
      { c: 1, r: 1, w: 1, h: 4, k: 'text' },
      { c: 2, r: 1, w: 1, h: 4, k: 'text', flaw: { marginTop: '7cqw' } },
      { c: 3, r: 1, w: 1, h: 4, k: 'text' },
    ],
    why: 'Three columns hang from one line and the fourth starts lower. The horizontal reference is broken.',
  },
  {
    els: [
      { c: 0, r: 0, w: 2, h: 2, k: 'pic' },
      { c: 2, r: 0, w: 2, h: 2, k: 'pic' },
      { c: 0, r: 2, w: 2, h: 2, k: 'pic', flaw: { width: '108%' } },
      { c: 2, r: 2, w: 2, h: 2, k: 'pic' },
      { c: 0, r: 4, w: 2, h: 2, k: 'text' },
      { c: 2, r: 4, w: 2, h: 2, k: 'text' },
    ],
    why: 'One picture is wider than its module and eats the gutter. Pictures must relate to each other and to the grid.',
  },
  {
    els: [
      { c: 0, r: 0, w: 2, h: 1, k: 'head' },
      { c: 0, r: 1, w: 2, h: 1, k: 'text' },
      { c: 0, r: 2, w: 2, h: 1, k: 'head', flaw: { fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '6.4cqw', fontWeight: 400 } },
      { c: 0, r: 3, w: 2, h: 1, k: 'text' },
      { c: 2, r: 0, w: 2, h: 1, k: 'head' },
      { c: 2, r: 1, w: 2, h: 3, k: 'text' },
      { c: 0, r: 4, w: 4, h: 2, k: 'pic' },
    ],
    why: 'One heading changes face and size. Type sizes must relate to each other throughout.',
  },
];

export function Syntactics() {
  const { finish, done } = useStage();
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const right = useRef(0);
  const round = SYN[i];
  const last = i === SYN.length - 1;
  const choose = (k: number) => {
    if (pick !== null) return;
    setPick(k);
    if (round.els[k].flaw) right.current++;
  };
  const next = () => {
    if (last) return finish(Math.round((100 * right.current) / SYN.length));
    setI(i + 1);
    setPick(null);
  };
  return (
    <Task
      instruction="One element breaks the system. Tap it."
      count={`${i + 1} / ${SYN.length}`}
      foot={
        pick === null ? (
          <p className="s hint">Look at how the parts relate, not at the parts.</p>
        ) : (
          <Why text={(round.els[pick].flaw ? 'Yes. ' : 'No. ') + round.why}>
            <Btn onClick={next}>{last ? 'Finish' : 'Next'}</Btn>
          </Why>
        )
      }
    >
      <Fit r={0.8} className="sheet syn" key={i}>
        {round.els.map((e, k) => (
          <button
            key={k}
            disabled={pick !== null || done}
            onClick={() => choose(k)}
            className={`syn-el ${pick !== null && e.flaw ? 'right' : pick === k ? 'wrong' : ''}`}
            style={{
              left: `${6 + e.c * 22.5}%`,
              top: `${5 + e.r * 15.2}%`,
              width: `${e.w * 22.5 - 2.5}%`,
              height: `${e.h * 15.2 - 2}%`,
            }}
          >
            <span className={`syn-${e.k}`} style={e.flaw}>
              {e.k === 'head' ? 'Heading' : null}
            </span>
          </button>
        ))}
      </Fit>
    </Task>
  );
}

/* ---------- 03 Pragmatics: the same information, usable or not ---------- */

const TRAINS = [
  ['08.05', 'Bologna', 4], ['08.12', 'Firenze', 11], ['08.20', 'Genova', 2], ['08.31', 'Napoli', 9],
  ['08.44', 'Roma', 6], ['08.52', 'Torino', 13], ['09.03', 'Venezia', 1], ['09.10', 'Verona', 8],
] as const;
const MESS: CSSProperties[] = [
  { fontFamily: 'var(--serif)', fontStyle: 'italic', textAlign: 'right', fontSize: '5.4cqw', background: '#ffd400' },
  { textTransform: 'uppercase', letterSpacing: '.3em', fontSize: '3cqw', textAlign: 'center' },
  { fontWeight: 700, fontSize: '6.6cqw', color: '#fff', background: '#0057b8', transform: 'rotate(-2deg)' },
  { fontFamily: 'var(--serif)', fontSize: '3.6cqw', textAlign: 'center', textDecoration: 'underline' },
  { fontWeight: 700, fontSize: '4.4cqw', color: 'var(--red)', textAlign: 'right', transform: 'scaleX(.8)' },
  { textTransform: 'uppercase', fontSize: '3.4cqw', background: '#000', color: '#fff', textAlign: 'center' },
  { fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '4.8cqw', transform: 'rotate(1.5deg)' },
  { fontWeight: 700, fontSize: '3.8cqw', letterSpacing: '.12em', textAlign: 'right', background: 'var(--red)', color: '#fff' },
];
const PHRASE = [
  (t: string, d: string, p: number) => `${d} leaves ${t} from platform ${p}`,
  (t: string, d: string, p: number) => `Pl. ${p} — ${t} — ${d}`,
  (t: string, d: string, p: number) => `${d}! ${p}`,
  (t: string, d: string, p: number) => `at ${t}: binario ${p} for ${d}`,
  (t: string, d: string, p: number) => `${p} › ${d} (${t})`,
  (t: string, d: string, p: number) => `${t} ${d} platform no. ${p}`,
  (t: string, d: string, p: number) => `To ${d}, ${t}, pl. ${p}`,
  (t: string, d: string, p: number) => `${d} · ${t} · ${p}`,
];

export function Pragmatics() {
  const { finish, done } = useStage();
  const [targets] = useState(() => shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 2));
  const [mess] = useState(() => shuffle([0, 1, 2, 3, 4, 5, 6, 7]));
  const [step, setStep] = useState(0); // 0 ready, 1 messy, 2 ready, 3 clear
  const t0 = useRef(0);
  const times = useRef<number[]>([]);
  const misses = useRef(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const round = step < 2 ? 0 : 1;
  const target = TRAINS[targets[round]];

  const start = () => {
    t0.current = performance.now();
    setStep(step + 1);
  };
  const tap = (k: number) => {
    if (done || (step !== 1 && step !== 3)) return;
    if (k !== targets[round]) {
      misses.current++;
      setWrong(k);
      window.setTimeout(() => setWrong(null), 350);
      return;
    }
    times.current[round] = (performance.now() - t0.current) / 1000;
    if (step === 1) return setStep(2);
    const [a, b] = times.current;
    finish(
      Math.max(0, 100 - 20 * misses.current),
      `Complicated board: ${a.toFixed(1)} s. Clear board: ${b.toFixed(1)} s.`,
    );
  };

  const running = step === 1 || step === 3;
  return (
    <Task
      instruction={`Find the platform for ${target[1]}. Tap its row.`}
      count={`${round + 1} / 2`}
      foot={
        running ? (
          <p className="s hint">The clock is running.</p>
        ) : (
          <Why
            text={
              step === 0
                ? 'Two departure boards with the same eight trains. You will be timed on each.'
                : `${times.current[0].toFixed(1)} seconds. Now the same information, organised.`
            }
          >
            <Btn onClick={start}>Start</Btn>
          </Why>
        )
      }
    >
      <Fit r={0.8} className="sheet board-sheet">
        {!running && !done ? (
          <div className="board-wait d">{round === 0 ? 'A' : 'B'}</div>
        ) : step === 1 ? (
          <div className="mess">
            {mess.map((k, n) => {
              const [t, d, p] = TRAINS[k];
              return (
                <button key={k} style={MESS[n]} className={wrong === k ? 'shake' : ''} onClick={() => tap(k)}>
                  {PHRASE[n](t, d, p)}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="clear">
            <div className="clear-row head">
              <span>Time</span>
              <span>Destination</span>
              <span>Platform</span>
            </div>
            {TRAINS.map(([t, d, p], k) => (
              <button
                key={k}
                className={`clear-row ${wrong === k ? 'shake' : ''} ${done && k === targets[1] ? 'hit' : ''}`}
                onClick={() => tap(k)}
              >
                <span>{t}</span>
                <span>{d}</span>
                <span>{p}</span>
              </button>
            ))}
          </div>
        )}
      </Fit>
    </Task>
  );
}

/* ---------- 04 Discipline: no snap, only the eye ---------- */

export function Discipline() {
  const targets: Record<string, Pos> = {
    a: { x: 0, y: 0 }, b: { x: 1, y: 0 }, c: { x: 2, y: 1 }, d: { x: 0, y: 2 },
  };
  return (
    <Place
      cols={3}
      rows={3}
      ratio={1}
      snap={false}
      instruction="Nothing here is quite in place. Set each block exactly into the module beneath it."
      hint="There is no snap. Your eye is the only tool."
      pieces={[
        { id: 'a', w: 1, h: 1, label: 'Text', node: <span className="tx" />, start: { x: 0.09, y: 0.13 } },
        { id: 'b', w: 2, h: 1, label: 'Picture', node: <span className="px" />, start: { x: 0.88, y: -0.08 } },
        { id: 'c', w: 1, h: 1, label: 'Text', node: <span className="tx" />, start: { x: 2.07, y: 1.11 } },
        { id: 'd', w: 2, h: 1, label: 'Picture', node: <span className="px" />, start: { x: -0.1, y: 1.9 } },
      ]}
      solution={targets}
      judge={(pos, unit) => {
        const errs = Object.keys(targets).map((id) => {
          const p = pos[id]!;
          return Math.hypot(p.x - targets[id].x, p.y - targets[id].y) * unit;
        });
        const mean = errs.reduce((a, b) => a + b, 0) / errs.length;
        const score = errs.map((e) => Math.max(0, Math.min(1, 1 - (e - 1.5) / 8.5)));
        return {
          score: Math.round((100 * score.reduce((a, b) => a + b, 0)) / score.length),
          note: `Mean error ${mean.toFixed(1)} px.`,
          wrong: Object.keys(targets).filter((_, k) => errs[k] > 4),
        };
      }}
    />
  );
}

/* ---------- 05 Appropriateness ---------- */

const A = {
  sign: (t: string) => <div className="sp ap-sign"><span>{t}</span><b>→</b></div>,
  script: (t: string) => <div className="sp ap-script"><span>{t}</span></div>,
  ornate: (t: string) => <div className="sp ap-ornate"><i /><span>{t}</span><i /></div>,
  lapidary: (a: string, b: string) => <div className="sp ap-lap"><span>{a}</span><small>{b}</small></div>,
  shout: (t: string) => <div className="sp ap-shout"><span>{t}</span></div>,
  table: (rows: string[][]) => (
    <div className="sp ap-table">{rows.map((r, k) => <div key={k}><span>{r[0]}</span><span>{r[1]}</span></div>)}</div>
  ),
  giant: (t: string) => <div className="sp ap-giant"><span>{t}</span></div>,
  small: () => <div className="sp ap-small"><span className="tx" /></div>,
};

export function Appropriateness() {
  return (
    <Choose
      rounds={[
        {
          brief: 'Wayfinding in a hospital corridor.',
          options: [
            { node: A.sign('Emergency'), ok: true },
            { node: A.script('Emergency') },
            { node: A.ornate('Emergency') },
          ],
          why: 'It must be read at once, from a distance, under stress. Only one of these belongs to that problem.',
        },
        {
          brief: 'An invitation to a state dinner.',
          options: [
            { node: A.lapidary('The President requests the pleasure of your company', 'at dinner, the ninth of May') , ok: true },
            { node: A.shout('Dinner!') },
            { node: A.sign('Dinner') },
          ],
          why: 'Ceremony asks for a centered, lapidary setting: the right kind of expression for the occasion.',
        },
        {
          brief: 'The price list of a hardware store.',
          options: [
            { node: A.table([['Hinge, brass', '4.20'], ['Screws, box', '2.80'], ['Padlock', '9.50'], ['Hammer', '12.00'], ['Plane', '31.00']]), ok: true },
            { node: A.lapidary('Hinges, screws, padlocks & hammers', 'at honest prices') },
            { node: A.giant('Tools') },
          ],
          why: 'A list to be consulted wants flush-left columns and rules. Its beauty is in being easy to use.',
        },
        {
          brief: 'A poster to be read from across a square.',
          options: [
            { node: A.giant('Jazz'), ok: true },
            { node: A.small() },
            { node: A.lapidary('An evening of jazz', 'in the square') },
          ],
          why: 'The right kind of scale: the distance of the reader decides the size of the type.',
        },
      ]}
    />
  );
}

/* ---------- 06 Ambiguity ---------- */

const SEED = [0.13, 0.71, 0.42, 0.88, 0.27, 0.63, 0.05, 0.94, 0.36, 0.79, 0.5, 0.18];

export function Ambiguity() {
  return (
    <Dial
      rounds={[
        {
          brief: 'A poster titled Night and Day. Add ambiguity until one form says both.',
          why: 'One disc across the boundary reads as sun and as moon, each reading enriching the other. Beyond that the meanings multiply into noise.',
          sliders: [{ key: 't', label: 'Ambiguity', min: 0, max: 100, init: 4, target: [[40, 60]] }],
          render: ({ t }) => {
            const cx = 25 + (Math.min(t, 50) / 50) * 25;
            const chaos = Math.max(0, (t - 60) / 40);
            const extra = Math.floor(chaos * 7);
            return (
              <div className="amb">
                <div className="amb-night" style={{ transform: `rotate(${chaos * 38}deg)` }} />
                <div className="amb-disc" style={{ left: `${cx}%` }} />
                {Array.from({ length: extra }, (_, k) => (
                  <div
                    key={k}
                    className="amb-disc"
                    style={{
                      left: `${10 + SEED[k] * 80}%`,
                      top: `${10 + SEED[k + 4] * 80}%`,
                      width: `${12 + SEED[k + 2] * 30}%`,
                    }}
                  />
                ))}
                <div className="amb-title" style={{ transform: `rotate(${-chaos * 14}deg)` }}>
                  Night and Day
                </div>
              </div>
            );
          },
        },
      ]}
    />
  );
}

/* ---------- 07 Design is One ---------- */

const Cup = () => <div className="ob cup"><i /></div>;
const Lamp = ({ wild }: { wild?: boolean }) => (
  <div className={`ob lamp ${wild ? 'wild' : ''}`}><i /><b /><u /></div>
);
const MiniPage = ({ wild }: { wild?: boolean }) => (
  <div className={`ob mpage ${wild ? 'wild' : ''}`}><b>Title</b><span className="tx" /></div>
);
const MiniSign = ({ wild }: { wild?: boolean }) => (
  <div className={`ob msign ${wild ? 'wild' : ''}`}><b>Exit →</b></div>
);

export function DesignIsOne() {
  return (
    <Choose
      rounds={[
        {
          brief: 'A cup and a lamp. Which pair comes from one discipline?',
          r: 1.5,
          cols: 1,
          options: [
            { node: <div className="sp pair"><Cup /><Lamp /></div>, ok: true },
            { node: <div className="sp pair"><Cup /><Lamp wild /></div> },
          ],
          why: 'Primary forms in simple relationships, in both objects. The other lamp has a style; it has no discipline.',
        },
        {
          brief: 'A page and a sign. Which pair comes from one discipline?',
          r: 1.5,
          cols: 1,
          options: [
            { node: <div className="sp pair"><MiniPage /><MiniSign /></div>, ok: true },
            { node: <div className="sp pair"><MiniPage /><MiniSign wild /></div> },
          ],
          why: 'The same structure, face and alignment govern both. Subjects change; the process controlling them does not.',
        },
        {
          brief: 'What can one design discipline be applied to?',
          options: [
            { text: 'Anything, from the spoon to the city.', ok: true },
            { text: 'Whatever suits its particular style.' },
            { text: 'Print. Objects need a different discipline.' },
          ],
          why: 'Design is a discipline, not a style, and it stands above every subject it is applied to.',
        },
      ]}
    />
  );
}

/* ---------- 08 Visual Power ---------- */

export function VisualPower() {
  return (
    <Dial
      rounds={[
        {
          brief: 'A book review page. Give it power, not noise.',
          r: 0.707,
          why: 'Power comes from contrast of scale: one headline far larger than everything else. Emphasis spread everywhere is impact without strength.',
          sliders: [
            { key: 's', label: 'Scale of the headline', min: 1, max: 10, step: 0.1, init: 2.4, fmt: (v) => `${v.toFixed(1)} ×`, target: [[7.5, 10]] },
            { key: 'n', label: 'Emphasis elsewhere', min: 0, max: 100, init: 62, target: [[0, 10]] },
          ],
          render: ({ s, n }) => {
            const k = n / 100;
            return (
              <div className="sp vp">
                <div className="vp-head" style={{ fontSize: `${s * 3.3}cqw` }}>Books</div>
                <div className="vp-cols">
                  {[0, 1, 2].map((c) => (
                    <div key={c}>
                      <b style={css({ fontSize: `${2.4 + k * 4}cqw`, color: k > 0.35 && c !== 1 ? 'var(--red)' : '#000', textDecoration: k > 0.55 ? 'underline' : 'none', background: k > 0.75 && c === 1 ? '#ffd400' : 'none' })}>
                        {['Fiction', 'History', 'Poetry'][c]}
                      </b>
                      <span className="tx" />
                      <em style={css({ opacity: k > 0.2 ? 1 : 0, transform: `scale(${0.4 + k * 1.1}) rotate(${(c - 1) * 9 * k}deg)` })}>
                        New!
                      </em>
                      <span className="tx" />
                    </div>
                  ))}
                </div>
              </div>
            );
          },
        },
      ]}
    />
  );
}

/* ---------- 09 Intellectual Elegance ---------- */

export function IntellectualElegance() {
  const ask = 'Two answers to one problem. Which has elegance of the mind?';
  return (
    <Choose
      rounds={[
        {
          brief: `A sale. ${ask}`,
          r: 0.707,
          options: [
            { node: <div className="sp ie-good"><b>Sale</b><span>Fifty per cent off everything, until Saturday.</span></div>, ok: true },
            { node: <div className="sp ie-sale"><em>SALE!!!</em><b>50% OFF</b><i>Everything must go</i><u>Hurry!</u></div> },
          ],
          why: 'Both announce the same fact. One trusts the reader; the other shouts at them.',
        },
        {
          brief: `A warning. ${ask}`,
          r: 1.4,
          cols: 1,
          options: [
            { node: <div className="sp ie-warn"><b>Danger</b><span>High voltage</span></div>, ok: true },
            { node: <div className="sp ie-cute"><i>~ please do take care ~</i><span>there may be some voltage about</span></div> },
          ],
          why: 'Elegance of the mind is not politeness or prettiness. Here it is the blunt clarity that keeps someone alive.',
        },
        {
          brief: `A shop receipt. ${ask}`,
          r: 0.707,
          options: [
            { node: <div className="sp ie-rcpt"><b>Ferramenta Rossi</b>{[['Hinge', '4.20'], ['Screws', '2.80'], ['Padlock', '9.50']].map((r) => <div key={r[0]}><span>{r[0]}</span><span>{r[1]}</span></div>)}<div className="tot"><span>Total</span><span>16.50</span></div></div>, ok: true },
            { node: <div className="sp ie-rcpt bad"><b>★ ROSSI ★</b><i>Your no. 1 for tools!!</i><div><span>Hinge.....4.20</span></div><div><span>SCREWS  2.80</span></div><div><span>padlock - 9.50</span></div><em>THANK YOU!</em><u>TOTAL 16.50</u></div> },
          ],
          why: 'The same care that makes a masterpiece can order three lines and a total. No artifact is too humble for it.',
        },
        {
          brief: `A concert programme. ${ask}`,
          r: 0.707,
          options: [
            { node: <div className="sp ie-prog"><b>Programme</b>{['Haydn', 'Bartók', 'Beethoven'].map((n, k) => <div key={n}><span>{n}</span><span>Quartet no. {k + 3}</span></div>)}</div>, ok: true },
            { node: <div className="sp ie-prog bad"><b>~ Programme ~</b><i>Haydn</i><em>BARTÓK</em><u>Beethoven</u><span>✦ ✦ ✦</span></div> },
          ],
          why: 'Three names, one structure. The other gives each composer a costume and tells the listener nothing more.',
        },
      ]}
    />
  );
}

/* ---------- 10 Timelessness ---------- */

export function Timelessness() {
  const P = 'Passing';
  return (
    <Sort
      instruction="Enduring, or passing fashion?"
      bins={[P, 'Enduring']}
      r={1.3}
      items={[
        { node: <div className="tl"><i className="tl-circle" /></div>, bin: 1, note: 'A primary shape in a primary colour has no date.' },
        { node: <div className="tl"><b className="tl-bevel">Click here</b></div>, bin: 0, note: 'Bevels and gloss belong to the year they were made.' },
        { node: <div className="tl"><span className="tl-word">Information</span></div>, bin: 1, note: 'Plain type, set flush left, looks for objectivity rather than novelty.' },
        { node: <div className="tl"><span className="tl-stretch">Information</span></div>, bin: 0, note: 'Deformed type is a trick, and tricks age fastest.' },
        { node: <div className="tl"><i className="tl-square" /></div>, bin: 1, note: 'The square was never in fashion, so it cannot go out of it.' },
        { node: <div className="tl"><span className="tl-glow">2000</span></div>, bin: 0, note: 'Glow and outline: visual titillation, not message.' },
        { node: <div className="tl tl-gridpage"><b>Title</b><span className="tx" /><span className="tx" /></div>, bin: 1, note: 'Structure, two sizes, white space. Economy lasts.' },
        { node: <div className="tl"><span className="tl-swoosh"><i />e-motion</span></div>, bin: 0, note: 'The swoosh of one decade is the embarrassment of the next.' },
        { node: <div className="tl"><i className="tl-triangle" /></div>, bin: 1, note: 'Primary shape, primary colour.' },
        { node: <div className="tl"><b className="tl-badge">All new look!</b></div>, bin: 0, note: 'Novelty for the sake of novelty.' },
      ]}
    />
  );
}

/* ---------- 11 Responsibility ---------- */

export function Responsibility() {
  return (
    <Choose
      rounds={[
        {
          brief: 'Three hundred national parks each need a brochure.',
          options: [
            { text: 'One modular system, printed on standard sheets.', ok: true },
            { text: 'A new size and format for every park.' },
            { text: 'A lavish die-cut folder for the famous parks only.' },
          ],
          why: 'Standard sizes within one system served every site and saved public money. Client and public are answered together.',
        },
        {
          brief: 'The budget is small. Your idea needs six colours and foil.',
          options: [
            { text: 'Find the idea that is right in two colours.', ok: true },
            { text: 'Persuade the client to spend more. The work deserves it.' },
            { text: 'Print it cheaply and explain the compromise afterwards.' },
          ],
          why: 'The economically appropriate solution is the problem to be solved, not an obstacle to it. A design stands without excuses.',
        },
        {
          brief: 'To whom is the designer responsible?',
          options: [
            { text: 'To the work, to the client and to the public, all three.', ok: true },
            { text: 'To the client, who pays for it.' },
            { text: 'To oneself and the integrity of the work.' },
          ],
          why: 'Three levels at once: integrity of the project, a sound answer for the client, and the person who finally uses it.',
        },
      ]}
    />
  );
}

/* ---------- 12 Equity ---------- */

const NAME = 'CALDERA'.split('');
const GAP = [0.9, -0.5, 1.4, -0.3, 1.1, -0.6, 0];
const WOB = [0.5, -0.4, 0.2, -0.6, 0.4, -0.2, 0.3];

export function Equity() {
  return (
    <Dial
      rounds={[
        {
          brief: 'Caldera, since 1906. The mark has aged. How far do you intervene?',
          r: 1.5,
          why: 'A light retouch evens the spacing and cleans the frame, and keeps seventy years of recognition. Further on, a landmark is traded for a concoction.',
          sliders: [{ key: 't', label: 'Intervention', min: 0, max: 100, init: 0, target: [[14, 36]] }],
          render: ({ t }) => {
            const worn = Math.max(0, 1 - t / 16);
            const m = Math.max(0, (t - 40) / 60);
            const modern = t > 58;
            return (
              <div className="eq">
                <div
                  className="eq-mark"
                  style={{
                    width: `${74 - m * 40}%`,
                    height: `${46 + m * 14}%`,
                    borderRadius: `${m * 50}%`,
                    background: t > 76 ? 'var(--red)' : '#000',
                    outlineOffset: `${1.2 + worn * 1.2}cqw`,
                    outlineWidth: `${0.5 + worn * 0.5}cqw`,
                    transform: `rotate(${worn * -1.6 - m * 12}deg)`,
                  }}
                >
                  <span
                    className="eq-name"
                    style={{
                      fontFamily: modern ? 'var(--sans)' : 'var(--serif)',
                      fontStyle: modern ? 'italic' : 'normal',
                      textTransform: modern ? 'lowercase' : 'uppercase',
                      fontSize: `${9 - m * 2}cqw`,
                    }}
                  >
                    {t > 88
                      ? 'c.'
                      : NAME.map((ch, k) => (
                          <i key={k} style={{ marginRight: `${GAP[k] * worn}cqw`, transform: `translateY(${WOB[k] * worn}cqw)` }}>
                            {ch}
                          </i>
                        ))}
                  </span>
                  {t <= 58 && <span className="eq-year">1906</span>}
                </div>
              </div>
            );
          },
        },
      ]}
    />
  );
}

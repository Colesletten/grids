import { useState, type CSSProperties, type ReactNode } from 'react';
import { Btn, Fit, Slider, Steps, Task, Why, useStage } from '../Stage';
import { Choose } from '../engines/Choose';
import { Sort } from '../engines/Sort';
import { Dial } from '../engines/Dial';
import { Order } from '../engines/Order';
import { Place, type Pos } from '../engines/Place';

/* ---------- 13 Paper Sizes ---------- */

function Halve() {
  const { finish } = useStage();
  const [n, setN] = useState(0);
  const [stopped, setStopped] = useState(false);
  // Each halving keeps the lower or the left half, turning as the A series does.
  const rects = [{ x: 0, y: 0, w: 100, h: 100 }];
  for (let k = 0; k < n; k++) {
    const p = rects[k];
    rects.push(k % 2 === 0 ? { x: p.x, y: p.y + p.h / 2, w: p.w, h: p.h / 2 } : { x: p.x, y: p.y, w: p.w / 2, h: p.h });
  }
  const ok = n === 4;
  return (
    <Task
      instruction="This sheet is A0. Halve it until you hold an A4."
      count="1 / 3"
      foot={
        stopped ? (
          <Why text={`${ok ? 'Yes.' : `No: this is A${n}.`} A0 halved four times is A4, one sixteenth of the sheet, and every half keeps the proportion of the whole.`}>
            <Btn onClick={() => finish(Math.max(0, 100 - 40 * Math.abs(n - 4)))}>Next</Btn>
          </Why>
        ) : (
          <div className="why">
            <p className="s hint">Each cut halves the longer side.</p>
            <div className="why-btns">
              <Btn kind="plain" onClick={() => setStopped(true)}>This is A4</Btn>
              <Btn onClick={() => setN(Math.min(n + 1, 8))}>Halve</Btn>
            </div>
          </div>
        )
      }
    >
      <Fit r={0.707} className="sheet paper">
        {rects.map((r, k) => (
          <div
            key={k}
            className={`paper-r rise ${k === n ? 'now' : ''}`}
            style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}
          >
            {(stopped || k === 0) && <b>A{k}</b>}
          </div>
        ))}
      </Fit>
    </Task>
  );
}

export function PaperSizes() {
  return (
    <Steps
      parts={[
        () => <Halve />,
        () => (
          <Choose
            rounds={[
              {
                brief: 'A4 measures, in millimetres:',
                cols: 2,
                options: [
                  { text: '210 × 297', ok: true },
                  { text: '216 × 279' },
                  { text: '148 × 210' },
                  { text: '297 × 420' },
                ],
                why: 'A4 is 210 by 297 mm. 216 by 279 is the American letter, a size that leads to nothing.',
              },
            ]}
          />
        ),
        () => (
          <Dial
            rounds={[
              {
                brief: 'Fold the A4 so that what remains is a square.',
                r: 0.707,
                falloff: 0.14,
                why: 'About two thirds of an A4 is a square: an economical accident of the proportion, and the reason a letter folds so well.',
                sliders: [{ key: 'f', label: 'Fold', min: 30, max: 95, step: 0.5, init: 40, target: [[65, 72.5]] }],
                render: ({ f }) => (
                  <div className="sp fold">
                    <div className="fold-sq" style={{ height: `${f}%` }} />
                    <div className="fold-rest" style={{ top: `${f}%` }} />
                  </div>
                ),
              },
            ]}
          />
        ),
      ]}
    />
  );
}

/* ---------- 14 Grids ---------- */

export function GridSpec({ c, r, pad = 4 }: { c: number; r: number; pad?: number }) {
  return (
    <div
      className="sp gridspec"
      style={{
        padding: `${pad}cqw`,
        gap: `${Math.min(1.6, 30 / Math.max(c, r))}cqw`,
        gridTemplateColumns: `repeat(${c}, 1fr)`,
        gridTemplateRows: `repeat(${r}, 1fr)`,
      }}
    >
      {Array.from({ length: c * r }, (_, k) => (
        <i key={k} />
      ))}
    </div>
  );
}

export function Grids() {
  return (
    <Choose
      rounds={[
        {
          brief: 'A newspaper page: many short stories, pictures of every size.',
          r: 0.75,
          options: [{ node: <GridSpec c={6} r={8} />, ok: true }, { node: <GridSpec c={2} r={2} /> }, { node: <GridSpec c={1} r={1} /> }],
          why: 'Six columns or more for a newspaper: enough alternatives to place everything and still keep order.',
        },
        {
          brief: 'Which of these grids is the same as having none?',
          r: 0.75,
          options: [{ node: <GridSpec c={24} r={32} />, ok: true }, { node: <GridSpec c={3} r={6} /> }, { node: <GridSpec c={2} r={4} /> }],
          why: 'The smaller the module, the less it helps. An empty page is a page with an infinitely fine grid.',
        },
        {
          brief: 'A brochure: text, and a few pictures.',
          r: 0.75,
          options: [{ node: <GridSpec c={3} r={6} />, ok: true }, { node: <GridSpec c={1} r={2} /> }, { node: <GridSpec c={12} r={16} /> }],
          why: 'Two, three or four columns for a book or brochure, with modules to give the pictures a horizontal reference.',
        },
        {
          brief: 'A magazine with varied pictures. Which grid is too coarse?',
          r: 0.75,
          options: [{ node: <GridSpec c={1} r={2} />, ok: true }, { node: <GridSpec c={4} r={8} /> }, { node: <GridSpec c={5} r={4} /> }],
          why: 'A coarse grid is very restricting: it offers too few alternatives for varied material.',
        },
      ]}
    />
  );
}

/* ---------- 15 A Company Letterhead ---------- */

export function Letterhead() {
  const solution: Record<string, Pos> = {
    name: { x: 1, y: 0 }, to: { x: 1, y: 1 }, body: { x: 1, y: 2 }, logo: { x: 0, y: 2 }, from: { x: 1, y: 5 },
  };
  const names: Record<string, string> = {
    name: 'The company name heads the second column.',
    to: 'The addressee belongs in the second module of the second column.',
    body: 'The letter starts at the third module and fills columns two and three.',
    logo: 'The symbol sits in the first column, just below the first fold.',
    from: 'The sender’s address closes the page across columns two and three.',
  };
  return (
    <Place
      cols={3}
      rows={6}
      ratio={0.707}
      instruction="Three columns, six modules. Set the letterhead on its grid."
      hint="Drag each part from the tray. The dashed lines are the folds."
      extras={<><span className="foldline" style={{ top: '33.33%' }} /><span className="foldline" style={{ top: '66.66%' }} /></>}
      pieces={[
        { id: 'name', w: 1, h: 1, label: 'Company', node: <span className="lh-name">Corpvida</span> },
        { id: 'to', w: 1, h: 1, label: 'Addressee', node: <span className="tx short" /> },
        { id: 'body', w: 2, h: 3, label: 'Letter', node: <span className="tx" /> },
        { id: 'logo', w: 1, h: 1, label: 'Symbol', node: <span className="lh-logo" /> },
        { id: 'from', w: 2, h: 1, label: 'Sender', node: <span className="tx foot" /> },
      ]}
      solution={solution}
      judge={(pos) => {
        const wrong = Object.keys(solution).filter(
          (id) => !pos[id] || pos[id]!.x !== solution[id].x || pos[id]!.y !== solution[id].y,
        );
        return {
          score: Math.round((100 * (5 - wrong.length)) / 5),
          wrong,
          note: wrong.length ? names[wrong[0]] : '',
        };
      }}
    />
  );
}

/* ---------- 16 Grids for Books ---------- */

const Book = ({ pr }: { pr: number }) => (
  <div className="sp book">
    <i className="px" style={{ width: `min(84cqw, ${84 * pr}cqh)`, height: `min(84cqh, ${84 / pr}cqw)` }} />
  </div>
);
const Lead = ({ off }: { off: number }) => (
  <div className="sp lead">
    <span className="tx" />
    <i className="px" style={{ top: `${8 + off}%`, bottom: `${8 - off * 1.4}%` }} />
  </div>
);

export function GridsForBooks() {
  return (
    <Choose
      rounds={[
        {
          brief: 'A book of square photographs. Which format?',
          options: [{ node: <Book pr={1} />, r: 1, ok: true }, { node: <Book pr={1} />, r: 0.7 }, { node: <Book pr={1} />, r: 1.5 }],
          why: 'Square pictures, square book. The content determines the container.',
        },
        {
          brief: 'A book of wide landscapes. Which format?',
          cols: 1,
          options: [{ node: <Book pr={1.6} />, r: 1.6, ok: true }, { node: <Book pr={1.6} />, r: 0.75 }, { node: <Book pr={1.6} />, r: 1 }],
          why: 'Oblong pictures ask for an oblong book, the format that exhibits the material best.',
        },
        {
          brief: 'Most pictures are 3 : 2. Which grid will crop them least?',
          r: 1,
          options: [{ node: <GridSpec c={2} r={3} />, ok: true }, { node: <GridSpec c={3} r={3} /> }, { node: <GridSpec c={3} r={2} /> }],
          why: 'Relate the module to the proportion of the majority of pictures, and few will need cropping.',
        },
        {
          brief: 'Type and picture on one grid. Which is set with care?',
          r: 1.3,
          cols: 1,
          options: [{ node: <Lead off={0} />, ok: true }, { node: <Lead off={2.6} /> }],
          why: 'Leading is chosen so that the picture begins and ends exactly on a line of type. A small thing, done by the masters.',
        },
      ]}
    />
  );
}

/* ---------- 17 Typefaces ---------- */

const Face = ({ name, year, style }: { name: string; year?: string; style: CSSProperties }) => (
  <div className="face">
    <span className="face-name" style={style}>{name}</span>
    <span className="face-abc" style={style}>ABCDEFGHIJKLM abcdefghijklm 1234567890</span>
    {year && <span className="face-year">{year}</span>}
  </div>
);

export function Typefaces() {
  const keep = 'One of the few basic ones.';
  return (
    <Sort
      instruction="A few basic typefaces are enough. Keep those, trash the rest."
      bins={['Trash', 'Keep']}
      r={1.5}
      items={[
        { node: <Face name="Garamond" year="1532" style={{ fontFamily: '"EB Garamond", serif' }} />, bin: 1, note: keep },
        { node: <Face name="Wedding Script" style={{ fontFamily: 'cursive', fontStyle: 'italic' }} />, bin: 0, note: 'Type as self-expression, not as organisation.' },
        { node: <Face name="Helvetica" year="1957" style={{ fontFamily: 'var(--sans)', fontWeight: 700 }} />, bin: 1, note: keep },
        { node: <Face name="Stretch Wide" style={{ fontFamily: 'var(--sans)', fontWeight: 700, transform: 'scaleX(1.7)', transformOrigin: 'left' }} />, bin: 0, note: 'A deformation, not a typeface.' },
        { node: <Face name="Bodoni" year="1788" style={{ fontFamily: 'var(--serif)' }} />, bin: 1, note: keep },
        { node: <Face name="Shadow Outline" style={{ fontFamily: 'var(--sans)', fontWeight: 700, color: '#fff', WebkitTextStroke: '0.25cqw #000', textShadow: '1cqw 1cqw 0 #000' }} />, bin: 0, note: 'Decoration applied to letters adds no information.' },
        { node: <Face name="Futura" year="1930" style={{ fontFamily: 'Futura, Jost, sans-serif', fontWeight: 500 }} />, bin: 1, note: keep },
        { node: <Face name="Barking Dog" style={{ fontFamily: 'fantasy', letterSpacing: '.08em', transform: 'skewX(-18deg)' }} />, bin: 0, note: 'When you write dog, the type should not bark.' },
        { node: <Face name="Century Expanded" year="1900" style={{ fontFamily: '"Old Standard TT", serif' }} />, bin: 1, note: keep },
        { node: <Face name="Squeeze Tall" style={{ fontFamily: 'var(--serif)', transform: 'scaleX(.45)', transformOrigin: 'left' }} />, bin: 0, note: 'Condensing by force is type deformation.' },
        { node: <Face name="Times Roman" year="1931" style={{ fontFamily: 'Tinos, "Times New Roman", serif' }} />, bin: 1, note: keep },
        { node: <Face name="RaNsOm NoTe" style={{ fontFamily: 'monospace', fontVariant: 'small-caps', letterSpacing: '-.06em' }} />, bin: 0, note: 'Made for novelty, and already tired.' },
      ]}
    />
  );
}

/* ---------- 18 Flush left, centered, justified ---------- */

const Use = ({ t }: { t: string }) => <div className="use"><b>{t}</b></div>;
const Rag = ({ w }: { w: number[] }) => (
  <div className="sp rag">{w.map((x, k) => <i key={k} style={{ width: `${x}%` }} />)}</div>
);

export function Alignment() {
  return (
    <Steps
      parts={[
        () => (
          <Sort
            instruction="How should it be set?"
            bins={['Flush left', 'Centered', 'Justified']}
            r={1.6}
            items={[
              { node: <Use t="The running text of a brochure" />, bin: 0, note: 'Most of the time: the eye returns to one fixed edge.' },
              { node: <Use t="A wedding invitation" />, bin: 1, note: 'Invitations and rhetorical compositions are centered.' },
              { node: <Use t="A caption beside a picture" />, bin: 0, note: 'Flush left, as nearly always.' },
              { node: <Use t="An inscription cut in stone" />, bin: 1, note: 'Lapidary text is centered.' },
              { node: <Use t="A school text book" />, bin: 2, note: 'Justified is used for text books, though it is contrived.' },
              { node: <Use t="The address at the foot of a letterhead" />, bin: 1, note: 'Centered, like a business card.' },
              { node: <Use t="An annual report" />, bin: 0, note: 'Flush left: no forced spacing, few broken words.' },
              { node: <Use t="A business card" />, bin: 1, note: 'One of the places where centered is appropriate.' },
            ]}
          />
        ),
        () => (
          <Choose
            rounds={[
              {
                brief: 'Flush left needs care on its ragged side. Which profile is controlled?',
                r: 1,
                options: [
                  { node: <Rag w={[92, 86, 94, 88, 93, 85, 90, 58]} />, ok: true },
                  { node: <Rag w={[96, 54, 99, 38, 91, 97, 70, 12]} /> },
                ],
                why: 'Shift words from line to line until the right edge has a quiet profile. Time-consuming, and worth it.',
              },
            ]}
          />
        ),
      ]}
    />
  );
}

/* ---------- 19 Type size relationships ---------- */

const SAMPLE =
  'The size of type is chosen in relation to the width of the column, so that each line holds a comfortable number of words and the eye finds the next line without effort. Leading follows the size. ';

function sizeRound(col: number, world: number, size: [number, number], lead: [number, number], init: [number, number]) {
  const pt = (0.3528 * 100) / world; // one point, in cqw
  return {
    brief: `A column ${col} mm wide. Set the size and the leading.`,
    r: 1.25,
    falloff: 0.22,
    why: `For a column of ${col} mm: ${size[0]} to ${size[1]} point, with ${lead[0] === lead[1] ? lead[0] : `${lead[0]} or ${lead[1]}`} point of extra leading.`,
    sliders: [
      { key: 's', label: 'Size', min: 6, max: 24, init: init[0], fmt: (v: number) => `${v} pt`, target: [size] },
      { key: 'l', label: 'Leading', min: 0, max: 8, init: init[1], fmt: (v: number, a: Record<string, number>) => `${a.s} on ${a.s + v}`, target: [lead] },
    ],
    render: ({ s, l }: Record<string, number>) => (
      <div className="sp ts">
        <div className="ts-col" style={{ width: `${(col * 100) / world}%`, fontSize: `${s * pt}cqw`, lineHeight: `${(s + l) * pt}cqw` }}>
          {SAMPLE.repeat(3)}
        </div>
        <span className="ts-cap" style={{ width: `${(col * 100) / world}%` }}>{col} mm</span>
      </div>
    ),
  };
}

export function TypeSize() {
  return (
    <Dial
      rounds={[
        sizeRound(60, 110, [8, 10], [1, 1], [18, 6]),
        sizeRound(120, 170, [12, 14], [1, 2], [7, 0]),
        sizeRound(180, 220, [16, 18], [2, 2], [8, 7]),
      ]}
    />
  );
}

/* ---------- 20 Rulers ---------- */

const FORM: { t: string; head?: boolean }[] = [
  { t: 'Order', head: true }, { t: 'Item' }, { t: 'Quantity' }, { t: 'Finish' },
  { t: 'Delivery', head: true }, { t: 'Address' }, { t: 'Date' },
  { t: 'Payment', head: true }, { t: 'Method' }, { t: 'Reference' },
];
type W = 'm' | 'h' | 'l';

export function Rulers() {
  const { finish, done } = useStage();
  const [w, setW] = useState<W[]>(FORM.map(() => 'm'));
  const [hang, setHang] = useState(false);
  const cycle = (k: number) => !done && setW(w.map((x, j) => (j !== k ? x : x === 'h' ? 'l' : 'h')));
  const check = () => {
    const ok = FORM.filter((f, k) => w[k] === (f.head ? 'h' : 'l')).length;
    finish(
      Math.round((100 * (ok + (hang ? 2 : 0))) / (FORM.length + 2)),
      !hang ? 'The type was left sitting on the rule below.' : ok < FORM.length ? 'Heavy rules belong to the major parts only.' : '',
    );
    window.setTimeout(() => {
      setW(FORM.map((f) => (f.head ? 'h' : 'l')));
      setHang(true);
    }, 900);
  };
  return (
    <Task
      instruction="An order form. Tap each rule to set its weight, then decide where the type sits."
      foot={
        <div className="dial-foot">
          <div className="seg b" role="group">
            <button className={!hang ? 'on' : ''} onClick={() => !done && setHang(false)}>Type sits on the rule below</button>
            <button className={hang ? 'on' : ''} onClick={() => !done && setHang(true)}>Type hangs from the rule above</button>
          </div>
          <Why text="Each tap changes a rule between 2 point and ½ point.">
            <Btn onClick={check}>Check</Btn>
          </Why>
        </div>
      }
    >
      <Fit r={0.8} className="sheet form">
        {FORM.map((f, k) => (
          <button key={k} className={`form-row ${w[k]} ${hang ? 'hang' : ''} ${f.head ? 'head' : ''}`} onClick={() => cycle(k)}>
            <span>{f.t}</span>
          </button>
        ))}
      </Fit>
    </Task>
  );
}

/* ---------- 21 Contrasting type sizes ---------- */

const SIZES = [2.3, 3.5, 6.4, 19];
const CT: { id: string; node: ReactNode; cls: string }[] = [
  { id: 'head', node: 'Kahn', cls: 'ct-head' },
  { id: 'sub', node: 'In the realm of architecture', cls: 'ct-sub' },
  { id: 'body', node: 'The plan is a society of rooms. Light gives each of them its character, and the structure is the giver of light. A building begins in the unmeasurable, passes through measurable means, and in the end is unmeasurable again.', cls: 'ct-body' },
  { id: 'cap', node: 'Introduction and new photography', cls: 'ct-cap' },
  { id: 'folio', node: '72', cls: 'ct-folio' },
];

export function Contrast() {
  const { finish, done } = useStage();
  const [s, setS] = useState<Record<string, number>>({ head: 2, sub: 1, body: 0, cap: 1, folio: 2 });
  const tap = (id: string) => !done && setS({ ...s, [id]: (s[id] + 1) % SIZES.length });
  const check = () => {
    const distinct = new Set(Object.values(s)).size;
    const others = Math.max(s.sub, s.body, s.cap, s.folio);
    const ratio = s.head > others ? SIZES[s.head] / SIZES[others] : 0;
    const score = (distinct <= 2 ? 60 : distinct === 3 ? 25 : 0) + (ratio >= 4 ? 40 : ratio >= 2 ? 15 : 0);
    finish(
      score,
      distinct > 2 ? `${distinct} sizes on one page.` : ratio < 4 ? 'The headline needs far more contrast with the text.' : '',
    );
    window.setTimeout(() => setS({ head: 3, sub: 0, body: 0, cap: 0, folio: 0 }), 900);
  };
  return (
    <Task
      instruction="Tap any line to change its size. Compose the page."
      foot={
        <Why text="Four sizes are available. You do not have to use them all.">
          <Btn onClick={check}>Check</Btn>
        </Why>
      }
    >
      <Fit r={0.707} className="sheet ct">
        {CT.map((e) => (
          <button key={e.id} className={e.cls} style={{ fontSize: `${SIZES[s[e.id]]}cqw` }} onClick={() => tap(e.id)}>
            {e.node}
          </button>
        ))}
      </Fit>
    </Task>
  );
}

/* ---------- 22 Scale ---------- */

const factor = (v: number) => 0.15 * Math.exp((Math.log(40) * v) / 100);
const Scene = ({ v }: { v: number }) => {
  const f = factor(v);
  const P = Math.min(26, 52 / f);
  return (
    <div className="scene">
      <div className="person" style={{ height: `${P}cqw` }}><i /><b /></div>
      <div className="chair" style={{ height: `${P * f}cqw` }}><i /><b /><u /></div>
    </div>
  );
};
const pctFmt = (v: number) => `${Math.round(factor(v) * 100)} %`;

export function Scale() {
  return (
    <Dial
      rounds={[
        {
          brief: 'A chair for this person. Find its scale.',
          r: 1.4,
          falloff: 0.12,
          why: 'Scale is the most appropriate size of a thing in its natural context: a seat at the height of the knee.',
          sliders: [{ key: 'v', label: 'Height of the chair', min: 0, max: 100, step: 0.5, init: 62, fmt: pctFmt, target: [[28, 35.5]] }],
          render: ({ v }) => <Scene v={v} />,
        },
        {
          brief: 'The same chair, as a monument for a square. Break the scale on purpose.',
          r: 1.4,
          falloff: 0.3,
          why: 'A little too large is a mistake. Many times too large is a decision, and it gives the object power and life.',
          sliders: [{ key: 'v', label: 'Height of the chair', min: 0, max: 100, step: 0.5, init: 31, fmt: pctFmt, target: [[80, 100]] }],
          render: ({ v }) => <Scene v={v} />,
        },
      ]}
    />
  );
}

/* ---------- 23 Texture ---------- */

const FINISH = ['Polished', 'Matte', 'Etched'];
const TEX_Q: [string, number, string][] = [
  ['Which surface reflects the light?', 0, 'A polished surface throws the light back as a sharp highlight.'],
  ['Which absorbs it?', 1, 'A dull surface takes the light in and returns it evenly.'],
  ['Which traps it?', 2, 'An etched or engraved surface holds the light inside its texture.'],
  ['An object meant to be restrained. Which finish?', 1, 'Matte: the quiet end of the range from opulent to restrained.'],
  ['An object meant to be opulent?', 0, 'Polish carries the connotation of richness.'],
];

export function Texture() {
  const { finish, done } = useStage();
  const [L, setL] = useState(30);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [right, setRight] = useState(0);
  const [q, ans, why] = TEX_Q[i];
  const last = i === TEX_Q.length - 1;
  const x = 18 + L * 0.64;
  const bg = [
    `radial-gradient(circle at ${x}% 30%, #fff 0 5%, #8a8a8a 12%, #1a1a1a 48%, #000 75%)`,
    `radial-gradient(circle at ${x}% 30%, #c9c9c9, #8d8d8d 60%, #6f6f6f)`,
    `repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 1.2%, transparent 1.2% 3.2%), radial-gradient(circle at ${x}% 30%, #f4f4f4, #b9b9b9 55%, #8f8f8f)`,
  ];
  const choose = (k: number) => {
    if (pick !== null || done) return;
    setPick(k);
    if (k === ans) setRight(right + 1);
  };
  const next = () => {
    if (last) return finish(Math.round((100 * right) / TEX_Q.length));
    setI(i + 1);
    setPick(null);
  };
  return (
    <Task
      instruction={q}
      count={`${i + 1} / ${TEX_Q.length}`}
      foot={
        <div className="dial-foot">
          <Slider label="Move the light" min={0} max={100} value={L} onChange={setL} />
          {pick === null ? (
            <p className="s hint">Three finishes of one form. Tap your answer.</p>
          ) : (
            <Why text={(pick === ans ? 'Yes. ' : 'No. ') + why}>
              <Btn onClick={next}>{last ? 'Finish' : 'Next'}</Btn>
            </Why>
          )}
        </div>
      }
    >
      <div className="tex">
        {FINISH.map((name, k) => (
          <button
            key={name}
            className={`opt ${pick === null ? '' : k === ans ? 'right' : k === pick ? 'wrong' : 'dim'}`}
            onClick={() => choose(k)}
          >
            <span className="tex-ball" style={{ background: bg[k] }} />
            <span className="b">{name}</span>
          </button>
        ))}
      </div>
    </Task>
  );
}

/* ---------- 24 Color ---------- */

const LINES: Record<string, [number, number][]> = {
  A: [[10, 20], [40, 20], [60, 40], [90, 40]],
  B: [[10, 80], [35, 80], [65, 50], [65, 10]],
  C: [[90, 85], [60, 85], [30, 55], [30, 10]],
};
const INKS = [
  { id: 'red', hex: '#f04e23', fam: 'red' },
  { id: 'blue', hex: '#0057b8', fam: 'blue' },
  { id: 'yellow', hex: '#ffd400', fam: 'yellow' },
  { id: 'pale red', hex: '#f6a58f', fam: 'red' },
  { id: 'pale blue', hex: '#6f9fd8', fam: 'blue' },
];

export function Color() {
  const { finish, done } = useStage();
  const [ink, setInk] = useState(0);
  const [paint, setPaint] = useState<Record<string, number>>({});
  const segs = Object.entries(LINES).flatMap(([n, pts]) =>
    pts.slice(1).map((p, k) => ({ id: `${n}${k}`, line: n, a: pts[k], b: p })),
  );
  const check = () => {
    const lineInk = Object.keys(LINES).map((n) => {
      const c = [0, 1, 2].map((k) => paint[`${n}${k}`]);
      return c.every((x) => x !== undefined && x === c[0]) ? c[0] : -1;
    });
    const consistent = lineInk.filter((x) => x >= 0).length;
    const fams = lineInk.filter((x) => x >= 0).map((x) => INKS[x].fam);
    const distinct = consistent === 3 && new Set(fams).size === 3;
    finish(
      consistent * 20 + (distinct ? 40 : 0),
      consistent < 3
        ? 'A line that changes colour on the way has lost its name.'
        : !distinct
          ? 'Two lines could be mistaken for one another.'
          : '',
    );
  };
  return (
    <Task
      instruction="Three lines, A, B and C. Colour them so a traveller can follow each from end to end."
      foot={
        <div className="dial-foot">
          <div className="inks">
            {INKS.map((c, k) => (
              <button key={c.id} aria-label={c.id} className={ink === k ? 'on' : ''} onClick={() => setInk(k)}>
                <i style={{ background: c.hex }} />
              </button>
            ))}
          </div>
          <Why text="Choose a colour, then tap each stretch of line.">
            <Btn onClick={check}>Check</Btn>
          </Why>
        </div>
      }
    >
      <Fit r={1}>
        <svg viewBox="0 0 100 100" className="transit">
          {segs.map((s) => (
            <line key={s.id} x1={s.a[0]} y1={s.a[1]} x2={s.b[0]} y2={s.b[1]} className="tr-line" style={{ stroke: paint[s.id] !== undefined ? INKS[paint[s.id]].hex : '#c4c4c4' }} />
          ))}
          {segs.map((s) => (
            <line key={s.id} x1={s.a[0]} y1={s.a[1]} x2={s.b[0]} y2={s.b[1]} className="tr-hit" onClick={() => !done && setPaint({ ...paint, [s.id]: ink })} />
          ))}
          {Object.entries(LINES).map(([n, pts]) =>
            pts.map((p, k) => <circle key={`${n}${k}`} cx={p[0]} cy={p[1]} r={k === 0 || k === 3 ? 3.4 : 2.2} className="tr-stop" />),
          )}
          {Object.entries(LINES).map(([n, pts]) =>
            [pts[0], pts[3]].map((p, k) => (
              <text key={`${n}${k}`} x={p[0]} y={p[1] + 1.5} className="tr-name">{n}</text>
            )),
          )}
        </svg>
      </Fit>
    </Task>
  );
}

/* ---------- 25 Layouts ---------- */

export function Layouts() {
  const overlap = (a: Pos & { w: number; h: number }, b: Pos & { w: number; h: number }) =>
    a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  const dims: Record<string, [number, number]> = {
    icon: [3, 3], a: [1, 1], b: [1, 1], head: [2, 1], t1: [1, 2], t2: [1, 2], cap: [1, 1],
  };
  return (
    <Place
      cols={6}
      rows={4}
      ratio={1.414}
      instruction="Compose the spread. Not everything in the tray deserves a place."
      hint="Sift first, then place. Leave the page room to breathe."
      extras={<span className="gutterline" />}
      pieces={[
        { id: 'icon', w: 3, h: 3, label: 'Picture 1', node: <span className="px icon"><i /></span> },
        { id: 'a', w: 1, h: 1, label: 'Picture 2', node: <span className="px weak" /> },
        { id: 'b', w: 1, h: 1, label: 'Picture 3', node: <span className="px weak two" /> },
        { id: 'head', w: 2, h: 1, label: 'Headline', node: <span className="lay-head">Light</span> },
        { id: 't1', w: 1, h: 2, label: 'Text', node: <span className="tx" /> },
        { id: 't2', w: 1, h: 2, label: 'Text', node: <span className="tx" /> },
        { id: 'cap', w: 1, h: 1, label: 'Caption', node: <span className="tx short" /> },
      ]}
      solution={{ icon: { x: 0, y: 0 }, cap: { x: 0, y: 3 }, head: { x: 4, y: 0 }, t1: { x: 4, y: 1 }, t2: { x: 5, y: 1 }, a: null, b: null }}
      judge={(pos) => {
        const on = Object.keys(dims).filter((id) => pos[id]).map((id) => ({ id, ...pos[id]!, w: dims[id][0], h: dims[id][1] }));
        const get = (id: string) => on.find((o) => o.id === id);
        const [icon, head, t1, t2, cap] = ['icon', 'head', 't1', 't2', 'cap'].map(get);
        const tests: [boolean, string][] = [
          [!!icon && !get('a') && !get('b'), 'Keep the one image with the force of an icon; leave the weak ones out.'],
          [!!head && !!t1 && !!t2 && !on.some((p, i) => on.some((q, j) => i < j && overlap(p, q))), 'Headline and both texts must be placed, with nothing overlapping.'],
          [!!t1 && !!t2 && t1.y === t2.y, 'Columns of text hang from the same line.'],
          [!!cap && !!icon && ((cap.x + 1 === icon.x || cap.x === icon.x + 3) && cap.y >= icon.y && cap.y < icon.y + 3 || (cap.y === icon.y + 3 || cap.y + 1 === icon.y) && cap.x >= icon.x && cap.x < icon.x + 3), 'A caption stays beside its picture.'],
          [!!head && !!t1 && !!t2 && head.y < Math.min(t1.y, t2.y) && head.x === Math.min(t1.x, t2.x), 'The headline stands above the text, aligned with its first column.'],
        ];
        const failed = tests.filter((t) => !t[0]);
        return { score: (5 - failed.length) * 20, note: failed[0]?.[1] ?? '' };
      }}
    />
  );
}

/* ---------- 26 Sequence ---------- */

const Spread = ({ l, r }: { l: string; r: string }) => (
  <span className="spreadthumb"><i className={l} /><i className={r} /></span>
);

export function Sequence() {
  return (
    <Order
      instruction="Five spreads of a picture book. Put them in a cinematic order."
      items={[
        { id: 'title', label: 'Title', node: <Spread l="blank" r="ttl" /> },
        { id: 'text', label: 'Text beside a full-bleed picture', node: <Spread l="txt" r="bleed" /> },
        { id: 'full', label: 'One picture across the spread', node: <Spread l="bleed join" r="bleed" /> },
        { id: 'white', label: 'Full-bleed picture facing a white page', node: <Spread l="bleed" r="small" /> },
        { id: 'end', label: 'Closing text', node: <Spread l="txt" r="blank" /> },
      ]}
    />
  );
}

/* ---------- 27 Binding ---------- */

export function Binding() {
  return (
    <Choose
      rounds={[
        {
          brief: 'The spine: which do you specify?',
          r: 1.5,
          options: [
            { node: <div className="sp bind"><i className="block square" /></div>, ok: true },
            { node: <div className="sp bind"><i className="block round" /></div> },
          ],
          why: 'Square, because it gives the book a sharper look.',
        },
        {
          brief: 'The headband, between spine and pages.',
          r: 1.5,
          options: [
            { node: <div className="sp bind"><i className="band plain" /></div>, ok: true },
            { node: <div className="sp bind"><i className="band striped" /></div> },
          ],
          why: 'It exists in many variations; plain white is the one preferred.',
        },
        {
          brief: 'The cover will be laminated with paper. Which board?',
          options: [{ text: 'Calendered cardboard', ok: true }, { text: 'Regular chipboard' }],
          why: 'Paper shows every flaw, so the board must be smooth. Under cloth or leather, chipboard is sufficient.',
        },
        {
          brief: 'Which of these is the sandwich binding?',
          r: 1.5,
          options: [
            { node: <div className="sp bind"><i className="sandwich" /></div>, ok: true },
            { node: <div className="sp bind"><i className="wrapped" /></div> },
          ],
          why: 'Two bare boards holding a stack of white pages, with a cloth spine carrying the title.',
        },
        {
          brief: 'Why bind a picture book this way?',
          options: [
            { text: 'It opens flat, so one image can cross the spread.', ok: true },
            { text: 'It is the cheapest binding available.' },
            { text: 'It protects the pages from light.' },
          ],
          why: 'The main reason is to let the book open flat, which matters most when a picture runs across both pages.',
        },
      ]}
    />
  );
}

/* ---------- 28 Identity and diversity ---------- */

const SHAPES = ['circle', 'square', 'triangle', 'half', 'quarter', 'bars'];
const HUES = ['#f04e23', '#0057b8', '#ffd400', '#000', '#f04e23', '#0057b8'];
const R = [0.2, 0.9, 0.45, 0.7, 0.1, 0.6, 0.35, 0.8];

export function Identity() {
  return (
    <Dial
      rounds={[
        {
          brief: 'Six covers of one book series. How much may they differ?',
          r: 1.5,
          why: 'Constant identifiers with a changing illustration. Less than that and nothing is remembered; more and the series falls apart.',
          sliders: [{ key: 't', label: 'Diversity', min: 0, max: 100, init: 0, target: [[28, 62]] }],
          render: ({ t }) => {
            const c = Math.max(0, (t - 62) / 38);
            return (
              <div className="series">
                {SHAPES.map((sh, k) => (
                  <div key={k} className="cover-s" style={{ background: c > 0.5 && k % 2 ? '#ffd400' : '#fff', transform: `rotate(${(R[k] - 0.5) * 10 * c}deg)` }}>
                    <span className="band-s" style={{ top: `${R[k] * 62 * c}%`, height: `${14 + R[k + 1] * 26 * c}%`, background: c > 0.3 && k % 3 === 0 ? '#0057b8' : '#000' }}>
                      <b style={{ fontFamily: c > 0.6 && k % 2 ? 'var(--serif)' : 'var(--sans)', fontStyle: c > 0.6 && k % 2 ? 'italic' : 'normal', fontSize: `${2.2 + R[k + 2] * 3 * c}cqw` }}>Biblioteca</b>
                    </span>
                    <i className={`shape ${t < 12 ? 'circle' : sh}`} style={{ color: t < 28 ? '#000' : HUES[k], transform: `rotate(${(R[k + 1] - 0.5) * 120 * c}deg) scale(${1 + (R[k + 2] - 0.5) * 1.2 * c})` }} />
                  </div>
                ))}
              </div>
            );
          },
        },
      ]}
    />
  );
}

/* ---------- 29 White space ---------- */

const WsPage = ({ m, k }: Record<string, number>) => (
  <div className="sp ws" style={{ padding: `${m}%` }}>
    <b style={{ letterSpacing: `${k / 100}em` }}>Silence</b>
    <span className="tx" />
  </div>
);
const wsSliders = (m: number, k: number, tm?: [number, number], tk?: [number, number]) => [
  { key: 'm', label: 'Margins', min: 2, max: 40, init: m, target: tm && [tm] },
  { key: 'k', label: 'Letter spacing', min: -8, max: 80, init: k, target: tk && [tk] },
];

export function WhiteSpace() {
  return (
    <Dial
      rounds={[
        { brief: 'Tension. Make the page taut.', r: 0.707, sliders: wsSliders(18, 0, [2, 7]), render: (v) => <WsPage {...v} />, why: 'Tight margins set text and image against the very edge of the page.' },
        { brief: 'Serenity. Let the same page rest.', r: 0.707, sliders: wsSliders(5, 0, [24, 40]), render: (v) => <WsPage {...v} />, why: 'Wider margins deflate the tension and bring a certain serenity.' },
        { brief: 'Now loosen the word until it reads as dots.', r: 0.707, sliders: wsSliders(12, -4, undefined, [45, 80]), render: (v) => <WsPage {...v} />, why: 'Tight setting turns a word into a line; loose setting turns it into dots. Spacing gives words their character.' },
      ]}
    />
  );
}

/* ---------- 30 A collection of experiences ---------- */

const MOD = 'Parts relate as a half, a third, a double: never an odd, casual size in between.';

export function Experiences() {
  return (
    <Dial
      rounds={[
        {
          brief: 'A disc within a disc. Set the inner diameter.',
          r: 1, falloff: 0.1, why: MOD,
          sliders: [{ key: 'd', label: 'Inner disc', min: 15, max: 85, step: 0.5, init: 71, target: [[32, 34.5], [48.5, 51.5]] }],
          render: ({ d }) => <div className="disc"><i style={{ width: `${d}%` }} /></div>,
        },
        {
          brief: 'Two blocks on a shelf. Set the taller one.',
          r: 1, falloff: 0.1, why: MOD,
          sliders: [{ key: 'h', label: 'Second block', min: 110, max: 330, step: 1, init: 163, target: [[194, 206], [291, 309]] }],
          render: ({ h }) => <div className="blocks"><i style={{ height: '26%' }} /><b style={{ height: `${h * 0.26}%` }} /></div>,
        },
        {
          brief: 'Divide the bar.',
          r: 1, falloff: 0.1, why: MOD,
          sliders: [{ key: 'x', label: 'Division', min: 12, max: 88, step: 0.5, init: 41, target: [[32, 34.5], [48.5, 51.5], [65.5, 68]] }],
          render: ({ x }) => <div className="barx"><i style={{ width: `${x}%` }} /></div>,
        },
      ]}
    />
  );
}

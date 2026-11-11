import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

/* The stage is the right-hand page: every exercise is set inside it. */

export type StageApi = {
  finish: (score: number, note?: string) => void;
  done: boolean;
  result: ReactNode;
};

export const StageCtx = createContext<StageApi>({ finish() {}, done: false, result: null });
export const useStage = () => useContext(StageCtx);

export function Task({
  instruction,
  count,
  children,
  foot,
}: {
  instruction: ReactNode;
  count?: string;
  children: ReactNode;
  foot?: ReactNode;
}) {
  const { done, result } = useStage();
  return (
    <div className="task">
      <div className="task-inst b">
        <span>{instruction}</span>
        {count && <span className="count">{count}</span>}
      </div>
      <div className="task-canvas">{children}</div>
      <div className="task-foot">{done ? result : foot}</div>
    </div>
  );
}

export function Btn({
  children,
  onClick,
  kind = 'primary',
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  kind?: 'primary' | 'plain';
  disabled?: boolean;
}) {
  return (
    <button className={`btn b ${kind}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

/* Footer: a line of explanation hanging from the rule, actions beside it. */
export function Why({ text, children }: { text?: ReactNode; children?: ReactNode }) {
  return (
    <div className="why rise">
      <p className="s">{text}</p>
      <div className="why-btns">{children}</div>
    </div>
  );
}

/* A box of fixed proportion, as large as its cell allows.
   Everything inside is measured in cqw, so specimens scale as one. */
export function Fit({
  r,
  children,
  className = '',
  style,
}: {
  r: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className="fit">
      <div
        className={`fit-in ${className}`}
        style={{
          width: `min(100cqw, ${100 * r}cqh)`,
          height: `min(100cqh, ${100 / r}cqw)`,
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
  targets,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  display?: string;
  targets?: [number, number][] | null;
  disabled?: boolean;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  return (
    <label className="sl">
      <span className="sl-head b">
        <span>{label}</span>
        <span className="sl-val">{display}</span>
      </span>
      <span className="sl-track">
        <span className="sl-in">
          {targets?.map(([lo, hi], i) => (
            <span
              key={i}
              className="sl-target"
              style={{ left: `${pct(lo)}%`, width: `${Math.max(pct(hi) - pct(lo), 1.2)}%` }}
            />
          ))}
        </span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={label}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </span>
    </label>
  );
}

export function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize((s) => (s.w === r.width && s.h === r.height ? s : { w: r.width, h: r.height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

export function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/* Runs several small exercises as one plate and averages their scores. */
export function Steps({ parts }: { parts: (() => ReactNode)[] }) {
  const parent = useStage();
  const [i, setI] = useState(0);
  const scores = useRef<number[]>([]);
  const last = i === parts.length - 1;
  const api: StageApi = {
    done: last ? parent.done : false,
    result: last ? parent.result : null,
    finish: (score, note) => {
      scores.current[i] = score;
      if (last) {
        const all = scores.current;
        parent.finish(Math.round(all.reduce((a, b) => a + b, 0) / all.length), note);
      } else setI(i + 1);
    },
  };
  return (
    <StageCtx.Provider value={api}>
      <div className="steps rise" key={i}>
        {parts[i]()}
      </div>
    </StageCtx.Provider>
  );
}

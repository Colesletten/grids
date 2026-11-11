import { useRef, useState, type ReactNode } from 'react';
import { Btn, Fit, Slider, Task, Why, useStage } from '../Stage';

export type DialSlider = {
  key: string;
  label: string;
  min: number;
  max: number;
  init: number;
  step?: number;
  fmt?: (v: number, all: Record<string, number>) => string;
  target?: [number, number][];
};

export type DialRound = {
  brief: ReactNode;
  sliders: DialSlider[];
  render: (v: Record<string, number>, revealed: boolean) => ReactNode;
  why: string;
  r?: number;
  falloff?: number;
};

function grade(s: DialSlider, v: number, falloff: number) {
  if (!s.target) return null;
  const d = Math.min(...s.target.map(([lo, hi]) => (v < lo ? lo - v : v > hi ? v - hi : 0)));
  return Math.max(0, 1 - d / (falloff * (s.max - s.min)));
}

/* Measure: a continuous quantity, set by eye, then compared with the canon. */
export function Dial({ rounds }: { rounds: DialRound[] }) {
  const { finish, done } = useStage();
  const [i, setI] = useState(0);
  const round = rounds[i];
  const init = (r: DialRound) => Object.fromEntries(r.sliders.map((s) => [s.key, s.init]));
  const [v, setV] = useState<Record<string, number>>(() => init(round));
  const [set, setSet] = useState(false);
  const scores = useRef<number[]>([]);
  const last = i === rounds.length - 1;

  const commit = () => {
    const gs = round.sliders
      .map((s) => grade(s, v[s.key], round.falloff ?? 0.2))
      .filter((g): g is number => g !== null);
    scores.current[i] = gs.reduce((a, b) => a + b, 0) / gs.length;
    setSet(true);
  };
  const next = () => {
    if (!last) {
      setV(init(rounds[i + 1]));
      setI(i + 1);
      setSet(false);
    } else {
      const all = scores.current;
      finish(Math.round((100 * all.reduce((a, b) => a + b, 0)) / all.length));
    }
  };
  const here = scores.current[i] ?? 0;

  const foot = (
    <div className="dial-foot">
      {round.sliders.map((s) => (
        <Slider
          key={`${i}-${s.key}`}
          label={s.label}
          min={s.min}
          max={s.max}
          step={s.step ?? 1}
          value={v[s.key]}
          display={s.fmt ? s.fmt(v[s.key], v) : ''}
          targets={set ? s.target : null}
          disabled={set}
          onChange={(x) => setV({ ...v, [s.key]: x })}
        />
      ))}
      {set ? (
        <Why text={(here > 0.95 ? 'Yes. ' : here > 0.5 ? 'Close. ' : 'No. ') + round.why}>
          <Btn onClick={next}>{last ? 'Finish' : 'Next'}</Btn>
        </Why>
      ) : (
        <div className="why">
          <p className="s hint">Set it by eye, then commit.</p>
          <div className="why-btns">
            <Btn onClick={commit}>Set</Btn>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Task
      instruction={round.brief}
      count={rounds.length > 1 ? `${i + 1} / ${rounds.length}` : undefined}
      foot={done ? null : foot}
    >
      <Fit r={round.r ?? 1}>{round.render(v, set)}</Fit>
    </Task>
  );
}

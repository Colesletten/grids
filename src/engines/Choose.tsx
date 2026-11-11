import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Btn, Fit, Task, Why, shuffle, useStage } from '../Stage';

export type Opt = { node?: ReactNode; text?: string; ok?: boolean; r?: number };
export type Round = { brief: ReactNode; options: Opt[]; why: string; cols?: number; r?: number };

/* Judgment: several answers to one problem, one of them appropriate. */
export function Choose({ rounds }: { rounds: Round[] }) {
  const { finish, done } = useStage();
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const right = useRef(0);
  const round = rounds[i];
  const order = useMemo(() => shuffle(round.options.map((_, k) => k)), [i]); // eslint-disable-line
  const isText = round.options.some((o) => o.text);
  const cols = round.cols ?? (isText ? 1 : round.options.length === 4 ? 2 : round.options.length);
  const last = i === rounds.length - 1;

  const choose = (k: number) => {
    if (pick !== null) return;
    setPick(k);
    if (round.options[k].ok) right.current++;
  };
  const next = () => {
    if (!last) {
      setI(i + 1);
      setPick(null);
    } else finish(Math.round((100 * right.current) / rounds.length));
  };

  const foot =
    pick === null ? (
      <p className="s hint">Tap your choice.</p>
    ) : (
      <Why text={(round.options[pick].ok ? 'Yes. ' : 'No. ') + round.why}>
        <Btn onClick={next}>{last ? 'Finish' : 'Next'}</Btn>
      </Why>
    );

  return (
    <Task instruction={round.brief} count={`${i + 1} / ${rounds.length}`} foot={foot}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={i}
          className={`opts ${isText ? 'text' : ''} ${!isText && !round.cols && round.options.length === 3 ? 'n3' : ''}`}
          style={{ '--n': cols } as CSSProperties}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.28, ease: [0.3, 0, 0.2, 1] }}
        >
          {order.map((k) => {
            const o = round.options[k];
            const state =
              pick === null ? '' : o.ok ? 'right' : k === pick ? 'wrong' : 'dim';
            return (
              <button
                key={k}
                className={`opt ${state}`}
                onClick={() => choose(k)}
                disabled={pick !== null || done}
              >
                {o.text ? (
                  <span className="b">{o.text}</span>
                ) : (
                  <Fit r={o.r ?? round.r ?? 1}>{o.node}</Fit>
                )}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </Task>
  );
}

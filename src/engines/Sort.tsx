import { useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Fit, Task, useStage } from '../Stage';

export type SortItem = { node: ReactNode; bin: number; note: string };

/* Sifting: one card at a time, sent to the side where it belongs. */
export function Sort({
  items,
  bins,
  instruction,
  r = 1.4,
}: {
  items: SortItem[];
  bins: string[];
  instruction: string;
  r?: number;
}) {
  const { finish, done } = useStage();
  const [i, setI] = useState(0);
  const [fb, setFb] = useState<{ ok: boolean; text: string } | null>(null);
  const [dir, setDir] = useState(0);
  const right = useRef(0);

  const send = (b: number) => {
    if (i >= items.length) return;
    const it = items[i];
    const ok = it.bin === b;
    if (ok) right.current++;
    setFb({ ok, text: `${ok ? 'Yes.' : `No: ${bins[it.bin].toLowerCase()}.`} ${it.note}` });
    setDir(b - (bins.length - 1) / 2);
    const n = i + 1;
    setI(n);
    if (n === items.length) {
      window.setTimeout(() => finish(Math.round((100 * right.current) / items.length)), 450);
    }
  };

  const foot = (
    <div className="sort-foot">
      <p className={`s sort-fb ${fb && !fb.ok ? 'no' : ''}`} key={i}>
        {fb ? fb.text : 'Decide quickly. The first judgment is usually the trained one.'}
      </p>
      <div className="bins" style={{ gridTemplateColumns: `repeat(${bins.length}, 1fr)` }}>
        {bins.map((b, k) => (
          <button key={b} className="btn b primary" onClick={() => send(k)}>
            {b}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Task
      instruction={instruction}
      count={`${Math.min(i + 1, items.length)} / ${items.length}`}
      foot={foot}
    >
      <AnimatePresence custom={dir} initial={false}>
        {i < items.length ? (
          <motion.div
            key={i}
            className="sort-card"
            custom={dir}
            variants={{
              in: { opacity: 0, scale: 0.94 },
              on: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.08 } },
              out: (d: number) => ({
                x: `${d * 130}%`,
                opacity: 0,
                transition: { duration: 0.36, ease: [0.5, 0, 0.8, 0.4] as const },
              }),
            }}
            initial="in"
            animate="on"
            exit="out"
          >
            <Fit r={r} className="card">
              {items[i].node}
            </Fit>
          </motion.div>
        ) : (
          <motion.div
            key="end"
            className="sort-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
          >
            <span className="d">
              {right.current} / {items.length}
            </span>
            {done && <span className="b">sifted correctly</span>}
          </motion.div>
        )}
      </AnimatePresence>
    </Task>
  );
}

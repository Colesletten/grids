import { useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Btn, Task, Why, useSize, useStage } from '../Stage';

export type Pos = { x: number; y: number };
export type Piece = {
  id: string;
  w: number;
  h: number;
  label: string;
  node?: ReactNode;
  start?: Pos;
};
export type Judgment = { score: number; note?: string; wrong?: string[] };

/* Placement: pieces dragged onto a grid of columns and modules. */
export function Place({
  cols,
  rows,
  ratio,
  pieces,
  snap = true,
  judge,
  solution,
  instruction,
  hint,
  extras,
}: {
  cols: number;
  rows: number;
  ratio: number;
  pieces: Piece[];
  snap?: boolean;
  judge: (pos: Record<string, Pos | null>, unit: number) => Judgment;
  solution: Record<string, Pos | null>;
  instruction: string;
  hint: string;
  extras?: ReactNode;
}) {
  const { finish, done } = useStage();
  const [ref, size] = useSize<HTMLDivElement>();
  const [pos, setPos] = useState<Record<string, Pos | null>>(() =>
    Object.fromEntries(pieces.map((p) => [p.id, p.start ?? null])),
  );
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const grab = useRef({ dx: 0, dy: 0 });

  const hasTray = pieces.some((p) => !p.start);
  const gap = 12;
  const trayRows = pieces.length > 5 ? 2 : 1;
  const trayH = hasTray ? Math.min(size.h * 0.26, trayRows * 52 + (trayRows - 1) * 8) : 0;
  const availH = size.h - (hasTray ? trayH + gap : 0);
  const bw = Math.max(0, Math.min(size.w, availH * ratio));
  const bh = bw / ratio;
  const bx = (size.w - bw) / 2;
  const by = (availH - bh) / 2;
  const mg = bw * 0.045;
  const gg = bw * 0.018;
  const mw = (bw - 2 * mg - (cols - 1) * gg) / cols;
  const mh = (bh - 2 * mg - (rows - 1) * gg) / rows;
  const cellX = (x: number) => bx + mg + x * (mw + gg);
  const cellY = (y: number) => by + mg + y * (mh + gg);
  const pw = (p: Piece) => p.w * mw + (p.w - 1) * gg;
  const ph = (p: Piece) => p.h * mh + (p.h - 1) * gg;

  const perRow = Math.ceil(pieces.length / trayRows);
  const chipW = (size.w - (perRow - 1) * 8) / perRow;
  const chipH = (trayH - (trayRows - 1) * 8) / trayRows;
  const slot = (k: number) => ({
    x: (k % perRow) * (chipW + 8),
    y: size.h - trayH + Math.floor(k / perRow) * (chipH + 8),
  });

  const toCell = (p: Piece, x: number, y: number): Pos | null => {
    const cy = y + ph(p) / 2;
    if (hasTray && cy > by + bh + 4) return null;
    let gx = (x - bx - mg) / (mw + gg);
    let gy = (y - by - mg) / (mh + gg);
    if (snap) {
      gx = Math.round(gx);
      gy = Math.round(gy);
    }
    return {
      x: Math.max(snap ? 0 : -0.3, Math.min(cols - p.w + (snap ? 0 : 0.3), gx)),
      y: Math.max(snap ? 0 : -0.3, Math.min(rows - p.h + (snap ? 0 : 0.3), gy)),
    };
  };

  const down = (e: PointerEvent<HTMLDivElement>, p: Piece) => {
    if (done) return;
    const host = ref.current!.getBoundingClientRect();
    const px = e.clientX - host.left;
    const py = e.clientY - host.top;
    const at = pos[p.id];
    if (at) grab.current = { dx: px - cellX(at.x), dy: py - cellY(at.y) };
    else grab.current = { dx: pw(p) / 2, dy: ph(p) / 2 };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ id: p.id, x: px - grab.current.dx, y: py - grab.current.dy });
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const host = ref.current!.getBoundingClientRect();
    setDrag({
      id: drag.id,
      x: e.clientX - host.left - grab.current.dx,
      y: e.clientY - host.top - grab.current.dy,
    });
  };
  const up = (p: Piece) => {
    if (!drag) return;
    setPos({ ...pos, [p.id]: toCell(p, drag.x, drag.y) });
    setDrag(null);
  };

  const check = () => {
    const j = judge(pos, mw + gg);
    setWrong(j.wrong ?? []);
    finish(j.score, j.note);
    if (j.score < 100) {
      window.setTimeout(() => {
        setPos(solution);
        setWrong([]);
      }, 1400);
    }
  };

  const ghost = (() => {
    if (!drag || !snap) return null;
    const p = pieces.find((q) => q.id === drag.id)!;
    const c = toCell(p, drag.x, drag.y);
    return c && { x: cellX(c.x), y: cellY(c.y), w: pw(p), h: ph(p) };
  })();

  return (
    <Task
      instruction={instruction}
      foot={
        <Why text={hint}>
          <Btn onClick={check}>Check</Btn>
        </Why>
      }
    >
      <div className="place" ref={ref}>
        {size.w > 0 && (
          <>
            <div className="board" style={{ left: bx, top: by, width: bw, height: bh }}>
              {Array.from({ length: cols * rows }, (_, k) => (
                <span
                  key={k}
                  className="module"
                  style={{
                    left: mg + (k % cols) * (mw + gg),
                    top: mg + Math.floor(k / cols) * (mh + gg),
                    width: mw,
                    height: mh,
                  }}
                />
              ))}
              {extras}
            </div>
            {ghost && (
              <div
                className="ghost"
                style={{ left: ghost.x, top: ghost.y, width: ghost.w, height: ghost.h }}
              />
            )}
            {pieces.map((p, k) => {
              const at = pos[p.id];
              const dragging = drag?.id === p.id;
              const s = slot(k);
              const target = dragging
                ? { x: drag!.x, y: drag!.y, width: pw(p), height: ph(p) }
                : at
                  ? { x: cellX(at.x), y: cellY(at.y), width: pw(p), height: ph(p) }
                  : { x: s.x, y: s.y, width: chipW, height: chipH };
              return (
                <motion.div
                  key={p.id}
                  className={`piece ${at || dragging ? 'on' : 'chip'} ${dragging ? 'drag' : ''} ${
                    wrong.includes(p.id) ? 'wrong' : ''
                  }`}
                  initial={false}
                  animate={target}
                  transition={
                    dragging
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 480, damping: 36, mass: 0.8 }
                  }
                  onPointerDown={(e) => down(e, p)}
                  onPointerMove={move}
                  onPointerUp={() => up(p)}
                  onPointerCancel={() => setDrag(null)}
                >
                  {at || dragging ? (p.node ?? <span className="b">{p.label}</span>) : null}
                  <span className="piece-label b">{p.label}</span>
                </motion.div>
              );
            })}
          </>
        )}
      </div>
    </Task>
  );
}

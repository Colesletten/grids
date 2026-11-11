import { useState, type ReactNode } from 'react';
import { Reorder } from 'motion/react';
import { Btn, Task, Why, shuffle, useStage } from '../Stage';

export type OrderItem = { id: string; node: ReactNode; label: string };

/* Sequence: the same parts, in the order that makes them a whole. */
export function Order({ items, instruction }: { items: OrderItem[]; instruction: string }) {
  const { finish, done } = useStage();
  const [ids, setIds] = useState(() => {
    let s = shuffle(items.map((x) => x.id));
    if (s.every((id, k) => id === items[k].id)) s = [...s.slice(1), s[0]];
    return s;
  });
  const byId = Object.fromEntries(items.map((x) => [x.id, x]));

  const check = () => {
    const hits = ids.filter((id, k) => id === items[k].id).length;
    finish(Math.round((100 * hits) / items.length));
    window.setTimeout(() => setIds(items.map((x) => x.id)), 700);
  };

  return (
    <Task
      instruction={instruction}
      foot={
        <Why text="Drag the spreads into order, first at the top.">
          <Btn onClick={check}>Check</Btn>
        </Why>
      }
    >
      <Reorder.Group
        axis="y"
        values={ids}
        onReorder={done ? () => {} : setIds}
        className="order"
        as="ol"
      >
        {ids.map((id, k) => (
          <Reorder.Item
            key={id}
            value={id}
            className="order-item"
            drag={done ? false : 'y'}
            whileDrag={{ scale: 1.03, zIndex: 5, boxShadow: '0 12px 30px rgba(0,0,0,.18)' }}
            transition={{ type: 'spring', stiffness: 520, damping: 40 }}
          >
            <span className="b order-n">{k + 1}</span>
            <span className="order-thumb">{byId[id].node}</span>
            <span className="b order-label">{byId[id].label}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </Task>
  );
}

import { useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const ITEM_H = 40;
const VISIBLE_H = 185;
const PAD = (VISIBLE_H - ITEM_H) / 2; // 72px — gradient 영역과 동일

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

const Wrapper = styled.div`
  display: flex;
  width: 21.875rem;
  height: 11.5625rem;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const SelectedArea = styled.div`
  width: 21.875rem;
  height: ${ITEM_H}px;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  background: #efefef;
  border-radius: 0.5rem;
  pointer-events: none;
  z-index: 1;
`;

const GradientTop = styled.div`
  width: 21.875rem;
  height: ${PAD}px;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
  border-radius: 0.5rem 0.5rem 0 0;
  pointer-events: none;
  z-index: 2;
`;

const GradientBottom = styled.div`
  width: 21.875rem;
  height: ${PAD}px;
  position: absolute;
  bottom: 0;
  left: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 100%);
  border-radius: 0 0 0.5rem 0.5rem;
  pointer-events: none;
  z-index: 2;
`;

const Column = styled.div`
  width: 7.5rem;
  height: ${VISIBLE_H}px;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  z-index: 3;
`;

const ColumnInner = styled.div`
  padding: ${PAD}px 0;
`;

const Item = styled.div`
  height: ${ITEM_H}px;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: center;
  font-size: 1.125rem;
  font-family: 'Pretendard Variable';
  font-weight: 400;
  line-height: 1.4;
  color: ${({ $selected }) => ($selected ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.20)')};
  transition: color 0.15s;
  cursor: pointer;
`;

const Colon = styled.span`
  font-size: 1.125rem;
  font-family: 'Pretendard Variable';
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  z-index: 3;
  flex-shrink: 0;
`;

function ScrollColumn({ items, value, onChange }) {
  const ref = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const idx = items.indexOf(value);
    if (ref.current && idx >= 0) {
      ref.current.scrollTop = idx * ITEM_H;
    }
  }, []);

  const handleScroll = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!ref.current) return;
      const idx = Math.round(ref.current.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(idx, items.length - 1));
      ref.current.scrollTo({ top: clamped * ITEM_H, behavior: 'smooth' });
      onChange(items[clamped]);
    }, 80);
  }, [items, onChange]);

  return (
    <Column ref={ref} onScroll={handleScroll}>
      <ColumnInner>
        {items.map((item) => (
          <Item
            key={item}
            $selected={item === value}
            onClick={() => {
              const idx = items.indexOf(item);
              ref.current?.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' });
              onChange(item);
            }}
          >
            {item}
          </Item>
        ))}
      </ColumnInner>
    </Column>
  );
}

export default function TimePicker({ value = { hour: '09', minute: '00' }, onChange }) {
  function handleHour(hour) {
    onChange?.({ ...value, hour });
  }

  function handleMinute(minute) {
    onChange?.({ ...value, minute });
  }

  return (
    <Wrapper>
      <SelectedArea />
      <ScrollColumn items={HOURS} value={value.hour} onChange={handleHour} />
      <Colon>:</Colon>
      <ScrollColumn items={MINUTES} value={value.minute} onChange={handleMinute} />
      <GradientTop />
      <GradientBottom />
    </Wrapper>
  );
}

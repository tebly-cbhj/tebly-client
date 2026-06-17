import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const ITEM_H = 25;
const GAP = 10;
const STEP = ITEM_H + GAP; // 35px
const VISIBLE_H = 185;
const CENTER_PAD = (VISIBLE_H - ITEM_H) / 2; // 80px ← 70이 아닌 정확한 값

const Wrapper = styled.div`
  display: flex;
  width: 350px;
  height: ${VISIBLE_H}px;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
  position: relative;
`;

/* ── 오버레이: Wrapper 전체 너비, 텍스트 위에 올라가야 하므로 z-index 높게 ── */
const TopOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${CENTER_PAD}px;
  background: linear-gradient(180deg, #fff 0%, transparent 100%);
  pointer-events: none;
  z-index: 10;
`;

const SelectedBg = styled.div`
  position: absolute;
  top: ${CENTER_PAD}px;
  left: 0;
  right: 0;
  height: ${ITEM_H}px;
  background: ${({ theme }) => theme.colors.gray200};
  pointer-events: none;
  z-index: 0;
`;

const BottomOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${CENTER_PAD}px;
  background: linear-gradient(180deg, transparent 0%, #fff 100%);
  pointer-events: none;
  z-index: 10;
`;

const ColOuter = styled.div`
  flex: 1 0 0;
  height: ${VISIBLE_H}px;
  overflow: hidden;
  /* z-index 없음 → stacking context 안 만들어서 오버레이가 위에 표시됨 */
`;

const ScrollArea = styled.div`
  height: ${VISIBLE_H}px;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  gap: ${GAP}px;
  padding-top: ${CENTER_PAD}px;
  padding-bottom: ${CENTER_PAD}px;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Item = styled.div`
  flex-shrink: 0;
  height: ${ITEM_H}px;
  scroll-snap-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.colors.gray900};
  cursor: pointer;
  user-select: none;
  position: relative;  /* ✅ 추가 */
  z-index: 1;          /* ✅ SelectedBg(0)보다 위, 오버레이(10)보다 아래 */
`;

function WheelColumn({ items, selectedIndex, onSelect, infinite = false }) {
  const scrollRef = useRef(null);
  const loopedItems = infinite ? [...items, ...items, ...items] : items;
  const offset = infinite ? items.length : 0;
  const isMounted = useRef(false);

  useEffect(() => {
    if (!scrollRef.current) return;

    if (!isMounted.current) {
      scrollRef.current.scrollTop = (offset + selectedIndex) * STEP;
      isMounted.current = true;
    } else {
      scrollRef.current.scrollTo({
        top: (offset + selectedIndex) * STEP,
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  function handleScroll() {
    if (!scrollRef.current) return;
    const index = Math.round(scrollRef.current.scrollTop / STEP);

    if (infinite) {
      if (index < items.length / 2) {
        scrollRef.current.scrollTop = (index + items.length) * STEP;
      } else if (index >= items.length * 2.5) {
        scrollRef.current.scrollTop = (index - items.length) * STEP;
      }
    }

    const clamped = Math.max(0, Math.min(index, loopedItems.length - 1));
    const realIndex = infinite ? clamped % items.length : clamped;
    if (realIndex !== selectedIndex) onSelect(realIndex);
  }

  function handleClick(index) {
    const realIndex = infinite ? index % items.length : index;
    scrollRef.current?.scrollTo({ top: index * STEP, behavior: 'smooth' });
    onSelect(realIndex);
  }

  return (
    <ColOuter>
      <ScrollArea ref={scrollRef} onScroll={handleScroll}>
        {loopedItems.map((label, i) => (
          <Item key={i} onClick={() => handleClick(i)}>
            {label}
          </Item>
        ))}
      </ScrollArea>
    </ColOuter>
  );
}

const TODAY = new Date();
const YEARS = Array.from({ length: 10 }, (_, i) => TODAY.getFullYear() - 3 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function getDays(year, month) {
  return Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) => i + 1
  );
}

export default function DatePicker({ value, onChange }) {
  const initYear = value?.year ?? TODAY.getFullYear();
  const initMonth = value?.month ?? TODAY.getMonth() + 1;
  const initDay = value?.day ?? TODAY.getDate();

  const [yearIdx, setYearIdx] = useState(Math.max(0, YEARS.indexOf(initYear)));
  const [monthIdx, setMonthIdx] = useState(initMonth - 1);
  const [dayIdx, setDayIdx] = useState(initDay - 1);

  const year = YEARS[yearIdx];
  const month = monthIdx + 1;
  const days = getDays(year, month);

  useEffect(() => {
    if (dayIdx >= days.length) setDayIdx(days.length - 1);
  }, [year, month]);

  useEffect(() => {
    onChange?.({ year, month, day: days[Math.min(dayIdx, days.length - 1)] });
  }, [yearIdx, monthIdx, dayIdx]);

  return (
    <Wrapper>
      <TopOverlay />
      <SelectedBg />
      <BottomOverlay />

      <WheelColumn
        items={YEARS.map((y) => `${y}년`)}
        selectedIndex={yearIdx}
        onSelect={setYearIdx}
      />
      <WheelColumn
        items={MONTHS.map((m) => `${m}월`)}
        selectedIndex={monthIdx}
        onSelect={setMonthIdx}
        infinite
      />
      <WheelColumn
        items={days.map((d) => `${d}일`)}
        selectedIndex={dayIdx}
        onSelect={setDayIdx}
        infinite
      />
    </Wrapper>
  );
}

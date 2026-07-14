import Train from '../../assets/room-covers/train.svg?react';
import TrainSelected from '../../assets/room-covers/train-selected.svg?react';
import trainSelectedUrl from '../../assets/room-covers/train-selected.svg';

import Clock from '../../assets/room-covers/clock.svg?react';
import ClockSelected from '../../assets/room-covers/clock-selected.svg?react';
import clockSelectedUrl from '../../assets/room-covers/clock-selected.svg';

import Couple from '../../assets/room-covers/couple.svg?react';
import CoupleSelected from '../../assets/room-covers/couple-selected.svg?react';
import coupleSelectedUrl from '../../assets/room-covers/couple-selected.svg';

import Pattern from '../../assets/room-covers/pattern.svg?react';
import PatternSelected from '../../assets/room-covers/pattern-selected.svg?react';
import patternSelectedUrl from '../../assets/room-covers/pattern-selected.svg';

import Wink from '../../assets/room-covers/wink.svg?react';
import WinkSelected from '../../assets/room-covers/wink-selected.svg?react';
import winkSelectedUrl from '../../assets/room-covers/wink-selected.svg';

// 기본 방 커버 이미지 5종. url은 실제 room.imageUrl로 저장되는 최종 이미지(완성된 selected 버전),
// Icon(선택 전 미리보기)/SelectedIcon(선택됨 표시)은 선택 화면에서만 사용
export const ROOM_COVERS = [
  { id: 'train', Icon: Train, SelectedIcon: TrainSelected, url: trainSelectedUrl },
  { id: 'clock', Icon: Clock, SelectedIcon: ClockSelected, url: clockSelectedUrl },
  { id: 'couple', Icon: Couple, SelectedIcon: CoupleSelected, url: coupleSelectedUrl },
  { id: 'pattern', Icon: Pattern, SelectedIcon: PatternSelected, url: patternSelectedUrl },
  { id: 'wink', Icon: Wink, SelectedIcon: WinkSelected, url: winkSelectedUrl },
];

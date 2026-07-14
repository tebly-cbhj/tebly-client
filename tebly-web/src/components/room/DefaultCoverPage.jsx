import { useState } from 'react';
import styled from 'styled-components';
import Header from '../common/Header';
import Btn from '../common/Btn';
import { ROOM_COVERS } from './RoomCoverIcons';
import CheckBadge from '../../assets/room-covers/check-badge.svg?react';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  justify-content: center;
`;

const PageBox = styled.div`
  width: 100%;
  max-width: 390px;
  height: 100%;
  background: ${({ theme }) => theme.colors.bg};
  display: flex;
  flex-direction: column;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const ScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px 20px 100px;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CoverItem = styled.button`
  position: relative;
  width: 100%;
  max-width: 350px;
  height: 176px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid ${({ $selected, theme }) => ($selected ? theme.colors.primary100 : 'transparent')};
  padding: 0;
  cursor: pointer;
  background: transparent;
  box-sizing: border-box;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const CheckBadgeOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  pointer-events: none;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const BtnWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 390px;
  padding: 12px 20px 28px;
  background: ${({ theme }) => theme.colors.bg};
  box-sizing: border-box;
`;

export default function DefaultCoverPage({ initialSelectedId, onClose, onSelect }) {
  const [selectedId, setSelectedId] = useState(initialSelectedId ?? null);

  function handleComplete() {
    const cover = ROOM_COVERS.find((c) => c.id === selectedId);
    if (!cover) return;
    onSelect({ id: cover.id, url: cover.url });
  }

  return (
    <Overlay>
      <PageBox>
        <HeaderWrapper>
          <Header title="이미지 선택" leftIcon="back" onLeft={onClose} />
        </HeaderWrapper>

        <ScrollArea>
          {ROOM_COVERS.map(({ id, Icon, SelectedIcon }) => {
            const isSelected = selectedId === id;
            const CoverIcon = isSelected ? SelectedIcon : Icon;
            return (
              <CoverItem
                key={id}
                type="button"
                $selected={isSelected}
                onClick={() => setSelectedId(id)}
              >
                <CoverIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                {isSelected && (
                  <CheckBadgeOverlay>
                    <CheckBadge width="100%" height="100%" />
                  </CheckBadgeOverlay>
                )}
              </CoverItem>
            );
          })}
        </ScrollArea>

        <BtnWrapper>
          <Btn
            text="선택 완료"
            disabled={!selectedId}
            onClick={handleComplete}
          />
        </BtnWrapper>
      </PageBox>
    </Overlay>
  );
}

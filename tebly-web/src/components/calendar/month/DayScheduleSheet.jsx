import styled from 'styled-components';
import DragHandleIcon from '../../../assets/icons/drag-handle.svg?react';
import ChevronRightIcon from '../../../assets/icons/chevron-right.svg?react';
import { CATEGORY_ICON_MAP } from '../../room/CategoryIcons';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  z-index: 9999;
`;

const Sheet = styled.div`
  width: 100%;
  max-width: 490px;
  max-height: 75vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-radius: 32px 32px 0 0;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 -12px 20px 0 rgba(72, 72, 72, 0.2);
`;

const DragHandleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
  flex-shrink: 0;

  svg {
    display: block;
  }
`;

const Title = styled.h3`
  margin: 16px 0 0;
  ${({ theme }) => theme.typography.h3};
  color: ${({ theme }) => theme.colors.gray900};
  text-align: center;
  flex-shrink: 0;
`;

const ScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px 20px 44px 20px;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Row = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  background: transparent;
  text-align: left;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
`;

const CategoryIconBox = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;

  svg {
    width: 40px;
    height: 40px;
    display: block;
  }
`;

const RowText = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const RowTitle = styled.span`
  ${({ theme }) => theme.typography.s2};
  color: ${({ theme }) => theme.colors.gray900};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RowTime = styled.span`
  ${({ theme }) => theme.typography.caption1};
  color: ${({ theme }) => theme.colors.gray500};
`;

const ChevronBox = styled.div`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.gray300};
`;

const EmptyText = styled.p`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
  padding: 32px 0 12px;
  margin: 0;
`;

export default function DayScheduleSheet({ dateLabel, schedules = [], onClose, onScheduleClick }) {
  return (
    <Overlay onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <DragHandleWrapper>
          <DragHandleIcon />
        </DragHandleWrapper>

        <Title>{dateLabel} 전체 일정</Title>

        <ScrollArea>
          {schedules.length === 0 && <EmptyText>등록된 일정이 없어요.</EmptyText>}

          {schedules.map((schedule) => {
            const CategoryImage = CATEGORY_ICON_MAP[schedule.category]?.SelectedIcon;

            return (
              <Row
                key={schedule.id}
                type="button"
                onClick={() => onScheduleClick?.(schedule)}
              >
                <CategoryIconBox>
                  {CategoryImage && <CategoryImage />}
                </CategoryIconBox>

                <RowText>
                  <RowTitle>{schedule.label}</RowTitle>
                  <RowTime>{schedule.time || '종일'}</RowTime>
                </RowText>

                <ChevronBox>
                  <ChevronRightIcon width={20} height={20} />
                </ChevronBox>
              </Row>
            );
          })}
        </ScrollArea>
      </Sheet>
    </Overlay>
  );
}

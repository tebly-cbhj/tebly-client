import styled from 'styled-components';
import LockIcon from '../../assets/icons/lock.svg?react';
import UnlockIcon from '../../assets/icons/unlock.svg?react';

const Row = styled.div`
  display: flex;
  width: 350px;
  padding: 16px 0;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const LeftArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.gray900 : theme.colors.gray500};
  flex-shrink: 0;
`;

const Label = styled.span`
  ${({ $selected, theme }) =>
    $selected ? theme.typography.s2 : theme.typography.body2};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.gray900 : theme.colors.gray500};
`;

// 공개/비공개 각각 하나씩 독립된 Row로
export default function VisibilityOption({ isPrivate, onSelect }) {
  return (
    <>
      <Row onClick={() => onSelect(false)}>
        <LeftArea>
          <IconWrapper $selected={!isPrivate}>
            <UnlockIcon width={20} height={20} />
          </IconWrapper>
          <Label $selected={!isPrivate}>공개</Label>
        </LeftArea>
      </Row>

      <Row onClick={() => onSelect(true)}>
        <LeftArea>
          <IconWrapper $selected={isPrivate}>
            <LockIcon width={20} height={20} />
          </IconWrapper>
          <Label $selected={isPrivate}>비공개</Label>
        </LeftArea>
      </Row>
    </>
  );
}
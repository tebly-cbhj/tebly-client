import styled from 'styled-components';
import LockIcon from '../../assets/icons/lock.svg?react';
import UnlockIcon from '../../assets/icons/unlock.svg?react';
import ChevronDownIcon from '../../assets/icons/chevron-down.svg?react';
import { CATEGORY_ICONS } from '../room/CategoryIcons';

const Row = styled.div`
  display: flex;
  width: 100%;
  padding: 8px 20px;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
`;

const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1 0 0;
`;

const IconWrapper = styled.div`
  width: 52px;
  height: 52px;
  flex-shrink: 0;
`;

const CategoryName = styled.span`
  ${({ theme }) => theme.typography.body1};
  color: #000;
  flex: 1 0 0;
`;

const ActionButton = styled.div`
  display: flex;
  padding: 6px 10px;
  align-items: center;
  border-radius: 100px;
  background: ${({ theme }) => theme.colors.gray200};
  cursor: pointer;
  gap: 4px;
`;

const LockIconWrapper = styled.div`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.gray900};
  flex-shrink: 0;
`;

const ChevronWrapper = styled.div`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

export default function CategorySettingList({ iconId, name, isPrivate, onButtonClick, onRowClick, isDefault }) {
  const categoryIcon = CATEGORY_ICONS.find((c) => c.id === iconId);
  const Icon = categoryIcon?.Icon;

  return (
    <Row
      onClick={!isDefault ? onRowClick : undefined}
      style={{ cursor: !isDefault ? 'pointer' : 'default' }}
    >
      <CategoryInfo>
        <IconWrapper>
          {Icon && <Icon width={52} height={52} />}
        </IconWrapper>
        <CategoryName>{name}</CategoryName>
      </CategoryInfo>

      <ActionButton onClick={(e) => {
        e.stopPropagation();
        onButtonClick();
      }}>
        <LockIconWrapper>
          {isPrivate
            ? <LockIcon width={20} height={20} />
            : <UnlockIcon width={20} height={20} />
          }
        </LockIconWrapper>
        <ChevronWrapper>
          <ChevronDownIcon width={20} height={20} />
        </ChevronWrapper>
      </ActionButton>
    </Row>
  );
}
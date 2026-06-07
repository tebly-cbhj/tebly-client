import { useState } from 'react';
import styled from 'styled-components';
import TextFieldBase from '../common/Textfield';
import Btn from '../common/Btn';

import CloseIcon from '../../assets/icons/close-m.svg?react';
import CheckIcon from '../../assets/category/check.svg?react';

import AppointmentSelected from '../../assets/category/appointment_selected.svg?react';
import ClubSelected from '../../assets/category/club_selected.svg?react';
import FamilySelected from '../../assets/category/famliy_selected.svg?react';
import SelfStudySelected from '../../assets/category/selfstudy_selected.svg?react';
import WorkSelected from '../../assets/category/work_selected.svg?react';
import ClassSelected from '../../assets/category/class_selected.svg?react';
import FreeSelected from '../../assets/category/free_selected.svg?react';
import TeamProjectSelected from '../../assets/category/teamproject_selected.svg?react';
import OthersSelected from '../../assets/category/others_selected.svg?react';

const CATEGORY_ICONS = [
  { id: 'Appointment', Icon: AppointmentSelected },
  { id: 'Club', Icon: ClubSelected },
  { id: 'Family', Icon: FamilySelected },
  { id: 'SelfDevelopment', Icon: SelfStudySelected },
  { id: 'Work', Icon: WorkSelected },
  { id: 'Class', Icon: ClassSelected },
  { id: 'Leisure', Icon: FreeSelected },
  { id: 'TeamProject', Icon: TeamProjectSelected },
  { id: 'Other', Icon: OthersSelected },
];

const PopupBox = styled.div`
  width: 350px;
  height: 532px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 22px 0;
`;

const Title = styled.span`
  ${({ theme }) => theme.typography.s1};
  color: ${({ theme }) => theme.colors.gray900};
`;

const CloseButton = styled.button`
  width: 24px;
  height: 24px;
  margin-left: auto;
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
    display: block;
  }
`;

const TextFieldWrapper = styled.div`
  margin: 20px auto 0;
  padding: 0 22px;
`;

const IconGrid = styled.div`
  display: flex;
  width: 288px;
  align-items: flex-start;
  align-content: flex-start;
  gap: 24px;
  flex-wrap: wrap;
  margin: 32px auto 0;
`;

const IconButton = styled.button`
  position: relative;
  width: 80px;
  height: 80px;
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;

  svg {
    width: 80px;
    height: 80px;
    display: block;
  }
`;

const SelectedOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 30px;
    height: 16.667px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 7px;
  margin: 32px 22px 0;
`;

const ButtonWrapper = styled.div`
  width: 149px;
`;

export default function CreateCategoryPopup({ onClose, onSave }) {
  const [categoryName, setCategoryName] = useState('');
  const [selectedIconId, setSelectedIconId] = useState(null);

  const canSave = categoryName.trim() !== '' && selectedIconId !== null;

  function handleSave() {
    if (!canSave) return;

    onSave?.({
      name: categoryName.trim(),
      iconId: selectedIconId,
    });
  }

  return (
    <PopupBox>
      <Header>
        <Title>카테고리 추가</Title>

        <CloseButton type="button" onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </Header>

      <TextFieldWrapper>
        <TextFieldBase
          width="306px"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="카테고리명 입력"
        />
      </TextFieldWrapper>

      <IconGrid>
        {CATEGORY_ICONS.map(({ id, Icon }) => {
          const selected = selectedIconId === id;

          return (
            <IconButton
              key={id}
              type="button"
              onClick={() => setSelectedIconId(id)}
            >
              <Icon />

              {selected && (
                <SelectedOverlay>
                  <CheckIcon />
                </SelectedOverlay>
              )}
            </IconButton>
          );
        })}
      </IconGrid>

      <ButtonRow>
        <ButtonWrapper>
          <Btn
            text="취소"
            size="medium"
            variant="gray"
            onClick={onClose}
          />
        </ButtonWrapper>

        <ButtonWrapper>
          <Btn
            text="저장"
            size="medium"
            disabled={!canSave}
            onClick={handleSave}
          />
        </ButtonWrapper>
      </ButtonRow>
    </PopupBox>
  );
}
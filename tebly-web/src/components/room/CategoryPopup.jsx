import { useState } from 'react';
import styled from 'styled-components';
import Btn from '../common/Btn';
import CreateCategoryPopup from './CreateCategoryPopup';
import { useScheduleStore } from '../../store/ScheduleStore';

import DragHandleIcon from '../../assets/icons/drag-handle.svg?react';

import { CATEGORY_ICON_MAP } from './categoryIcons';

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
  z-index: 9999;
  align-items: center;
`;

const Sheet = styled.div`
  width: 390px;
  height: 534px;
  border-radius: 32px 32px 0 0;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 -4px 12px 0 rgba(68, 68, 68, 0.08);
`;

const DragHandleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 14px;

  svg {
    display: block;
  }
`;

const CategoryScroll = styled.div`
  max-height: 367px;
  overflow-y: auto;
  margin-top: 24px;
  padding: 0 31px;
  box-sizing: border-box;
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 80px);
  row-gap: 24px;
  column-gap: 24px;
  width: fit-content;
  margin: 0 auto;   /* ← 가운데 정렬은 이걸로 */
`;

const CategoryItem = styled.button`
  width: 80px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;

  svg {
    width: 80px;
    height: 80px;
    display: block;
  }
`;

const CategoryName = styled.div`
  height: 22px;
  margin-top: 4px;
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray900};
  text-align: center;
  white-space: nowrap;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 46.33px;
  padding: 0 27px;
`;

const ResetButtonWrapper = styled.div`
  width: 120px;
`;

const ConfirmButtonWrapper = styled.div`
  width: 204px;
`;

const AddPopupLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
`;


export default function CategoryPopup({ selectedCategory, onClose, onSelect }) {
  const categories = useScheduleStore((state) => state.categories);
  const addCategory = useScheduleStore((state) => state.addCategory);

  const [currentCategory, setCurrentCategory] = useState(
    selectedCategory || categories[0]?.name
  );
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

  return (
    <Overlay onClick={onClose}>
      {!isAddPopupOpen && (
    <Sheet onClick={(e) => e.stopPropagation()}>
      <DragHandleWrapper>
        <DragHandleIcon />
      </DragHandleWrapper>

      <CategoryScroll>  
        <CategoryContainer>
          {categories.map((category) => {
            const isSelected = currentCategory === category.name;
            const icons = CATEGORY_ICON_MAP[category.iconId] || CATEGORY_ICON_MAP.기타;
            const CategoryIcon = isSelected ? icons.SelectedIcon : icons.Icon;

            return (
              <CategoryItem
                key={category.name}
                type="button"
                onClick={() => setCurrentCategory(category.name)}
              >
                <IconWrapper>
                  <CategoryIcon />
                </IconWrapper>
                <CategoryName>{category.name}</CategoryName>
              </CategoryItem>
            );
          })}
        </CategoryContainer>
      </CategoryScroll>

      <ButtonRow>
        <ResetButtonWrapper>
          <Btn
            text="추가하기"
            size="medium"
            variant="gray"
            disabled={!currentCategory}
            onClick={() => setIsAddPopupOpen(true)}
          />
        </ResetButtonWrapper>

        <ConfirmButtonWrapper>
          <Btn
            text="선택 완료"
            size="medium"
            disabled={!currentCategory}
            onClick={() => onSelect(currentCategory)}
          />
        </ConfirmButtonWrapper>
      </ButtonRow>
    </Sheet>
  )}

      {isAddPopupOpen && (
        <AddPopupLayer onClick={(e) => e.stopPropagation()}>
          <CreateCategoryPopup
            onClose={() => setIsAddPopupOpen(false)}
            onSave={(newCategory) => {
              addCategory(newCategory);
              setCurrentCategory(newCategory.name);
              setIsAddPopupOpen(false);
            }}
          />
        </AddPopupLayer>
      )}
    </Overlay>
  );
}
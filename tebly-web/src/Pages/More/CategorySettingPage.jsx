import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import ToggleBtn from '../../components/more/ToggleBtn';
import CategorySettingList from '../../components/more/CategorySettingList';
import VisibilityOption from '../../components/more/VisibilityOption';
import CreateCategoryPopup from '../../components/room/CreateCategoryPopup';
import { useScheduleStore } from '../../store/ScheduleStore';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 12px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ToggleBtnWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
`;

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

const BottomSheet = styled.div`
  display: inline-flex;
  width: 100%;
  max-width: 390px;
  padding: 12px 20px 35.5px 20px;
  flex-direction: column;
  align-items: center;
  gap: 0;
  border-radius: 32px 32px 0 0;
  background: ${({ theme }) => theme.colors.white};
`;

const DragHandle = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 100px;
  background: ${({ theme }) => theme.colors.gray300};
  margin-bottom: 24px;
`;

const Divider = styled.div`
  width: 350px;
  height: 1px;
  background: ${({ theme }) => theme.colors.gray200};
`;

const DeleteRow = styled.div`
  display: flex;
  width: 350px;
  padding: 16px 0;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const DeleteText = styled.span`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.alert};
`;

export default function CategorySettingPage() {
  const navigate = useNavigate();
  const categories = useScheduleStore((state) => state.categories);
  const fetchCategories = useScheduleStore((state) => state.fetchCategories);
  const togglePrivate = useScheduleStore((state) => state.togglePrivate);
  const deleteCategory = useScheduleStore((state) => state.deleteCategory);
  const updateCategory = useScheduleStore((state) => state.updateCategory);

  const [tab, setTab] = useState('left');
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const selectedCategory = categories.find((c) => c.categoryId === selectedCategoryId);

  const defaultCategories = categories.filter((c) => c.isDefault);
  const myCategories = categories.filter((c) => !c.isDefault);

  const currentList = tab === 'left' ? defaultCategories : myCategories;

  function handleButtonClick(category) {
    setSelectedCategoryId(category.categoryId);
    setShowPopup(true);
  }

  return (
    <PageWrapper>
      <Header
        title="카테고리 설정"
        leftIcon="back"
        onLeft={() => navigate(-1)}
      />

      <ContentWrapper>
        <ToggleBtnWrapper>
          <ToggleBtn
            value={tab}
            onChange={setTab}
            leftLabel="기본"
            rightLabel="내 카테고리"
          />
        </ToggleBtnWrapper>

        {currentList.map((category) => (
          <CategorySettingList
            key={category.categoryId}
            iconId={category.categoryIcon}
            name={category.categoryName}
            isPrivate={category.isPrivate}
            isDefault={category.isDefault}
            onButtonClick={() => handleButtonClick(category)}
            onRowClick={() => {
              setSelectedCategoryId(category.categoryId);
              setShowEditPopup(true);
            }}
          />
        ))}
      </ContentWrapper>

      {/* 공개/비공개 팝업 */}
      {showPopup && (
        <Overlay onClick={() => setShowPopup(false)}>
          <BottomSheet onClick={(e) => e.stopPropagation()}>
            <DragHandle />

            <VisibilityOption
              isPrivate={selectedCategory?.isPrivate}
              onSelect={(value) => {
                if (value !== selectedCategory.isPrivate) {
                  togglePrivate(selectedCategory.categoryId);
                }
                setShowPopup(false);
              }}
            />

            {selectedCategory && !selectedCategory.isDefault && (
              <>
                <Divider />
                <DeleteRow onClick={() => {
                  deleteCategory(selectedCategory.categoryId);
                  setShowPopup(false);
                }}>
                  <DeleteText>삭제</DeleteText>
                </DeleteRow>
              </>
            )}
          </BottomSheet>
        </Overlay>
      )}

      {/* 카테고리 수정 팝업 */}
      {showEditPopup && selectedCategory && (
        <Overlay onClick={() => setShowEditPopup(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <CreateCategoryPopup
              title="카테고리 수정"
              initialName={selectedCategory.categoryName}
              initialIconId={selectedCategory.categoryIcon}
              onClose={() => setShowEditPopup(false)}
              onSave={(updated) => {
                updateCategory(selectedCategory.categoryId, updated);
                setShowEditPopup(false);
                }}
            />
          </div>
        </Overlay>
      )}

    </PageWrapper>
  );
}
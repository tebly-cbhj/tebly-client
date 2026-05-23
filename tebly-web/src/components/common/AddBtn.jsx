import { useState } from 'react';
import styled from 'styled-components';
import AddBtnIcon from '../../assets/icons/add_schedule.svg';

const ButtonWrapper = styled.div`
  position: relative;
`;

const PopupContainer = styled.div`
  position: absolute;
  bottom: 70px;
  right: 0;

  display: flex;
  width: 106px;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 9px;

  border-radius: 8px;
  background: #fff;
  box-shadow: ${(props) => props.theme.effects.shadow1};

  opacity: ${(props) => props.$isOpen ? 1 : 0};
  pointer-events: ${(props) => props.$isOpen ? 'auto' : 'none'};
  transform: ${(props) => props.$isOpen ? 'translateY(0)' : 'translateY(10px)'};
  transition: opacity 0.3s ease, transform 0.3s ease;
`;

const StyledIconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 56px;
  height: 56px;
  border: none;
  cursor: pointer;


  box-shadow: ${(props) => props.theme.effects.shadow1};

  transition: transform 0.3s ease;
  transform: ${(props) => props.$isOpen ? 'rotate(45deg)' : 'rotate(0deg)'};

  &:active {
    opacity: 0.8;
  }
`;

const AddBtn = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ButtonWrapper>
      <PopupContainer $isOpen={isOpen}>
        {/* 팝업 아이템들 */}
      </PopupContainer>

      <StyledIconButton $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <img src={AddBtnIcon} alt="add" width={24} height={24} />
      </StyledIconButton>
    </ButtonWrapper>
  );
};

export default AddBtn;
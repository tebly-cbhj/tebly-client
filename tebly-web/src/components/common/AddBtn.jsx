import { useState } from 'react';
import styled from 'styled-components';
import AddBtnIcon from '../../assets/icons/add_schedule.svg';


const ButtonWrapper = styled.div`
  position: relative;
`;

const StyledIconButton = styled.img`
  width: 56px;
  height: 56px;
  cursor: pointer;

  transition: transform 0.3s ease;
  transform: ${(props) => props.$isOpen ? 'rotate(45deg)' : 'rotate(0deg)'};
`;

const AddBtn = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ButtonWrapper>
      <StyledIconButton
        src={AddBtnIcon}
        alt="add"
        $isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />
    </ButtonWrapper>
  );
};

export default AddBtn;
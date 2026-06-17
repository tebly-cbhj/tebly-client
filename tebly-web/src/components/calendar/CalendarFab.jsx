import { useState } from 'react';
import styled from 'styled-components';
import AddBtnIcon from '../../assets/icons/add_schedule.svg';
import CalendarFabMenu from './CalendarFabMenu';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 98;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  z-index: 99;
`;

const FabButton = styled.img`
  width: 56px;
  height: 56px;
  cursor: pointer;
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(45deg)' : 'rotate(0deg)')};
`;

export default function CalendarFab({ onDirectInput, onAiRecognition }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleMenuAction(action) {
    setIsOpen(false);
    action?.();
  }

  return (
    <>
      {isOpen && <Overlay onClick={() => setIsOpen(false)} />}
      <Wrapper>
        {isOpen && (
          <CalendarFabMenu
            onDirectInput={() => handleMenuAction(onDirectInput)}
            onAiRecognition={() => handleMenuAction(onAiRecognition)}
          />
        )}
        <FabButton
          src={AddBtnIcon}
          alt="add"
          $isOpen={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        />
      </Wrapper>
    </>
  );
}

import styled from 'styled-components';
import Btn from '../common/Btn';

import CloseIcon from '../../assets/icons/close-m.svg?react';
import PokeIcon from '../../assets/icons/pokeicon.svg?react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Popup = styled.div`
  position: relative;
  width: 350px;
  height: 412px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 21px;
  right: 20px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  svg {
    display: block;
  }
`;

const PokeIconWrapper = styled.div`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);

  svg {
    display: block;
  }
`;

const PopupTitle = styled.h3`
  position: absolute;
  top: 257px;
  left: 50%;
  transform: translateX(-50%);
  height: 28px;
  margin: 0;
  ${({ theme }) => theme.typography.h3};
  color: ${({ theme }) => theme.colors.gray900};
  text-align: center;
  white-space: nowrap;
`;

const PopupText = styled.p`
  position: absolute;
  top: 293px;
  left: 50%;
  transform: translateX(-50%);
  height: 20px;
  margin: 0;
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
  white-space: nowrap;
`;

const PopupBtnWrapper = styled.div`
  position: absolute;
  bottom: 24px;
  left: 20px;
  right: 20px;
`;

export default function PokePopup({ memberName, onClose, onPoke }) {
  return (
    <Overlay onClick={onClose}>
      <Popup onClick={(e) => e.stopPropagation()}>
        <CloseButton type="button" onClick={onClose}>
          <CloseIcon />
        </CloseButton>

        <PokeIconWrapper>
          <PokeIcon />
        </PokeIconWrapper>

        <PopupTitle>콕, 한 번 찔러볼까요?</PopupTitle>
        <PopupText>답변을 잊고 있는 친구에게 다시 알림을 보내요.</PopupText>

        <PopupBtnWrapper>
          <Btn text="콕 찌르기" onClick={onPoke} />
        </PopupBtnWrapper>
      </Popup>
    </Overlay>
  );
}
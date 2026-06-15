import styled from 'styled-components';
import Back from '../../assets/icons/back.svg?react';
import Bell from '../../assets/icons/bell-line.svg?react';
import BellNoti from '../../assets/icons/bell-noti.svg?react';
import Letter from '../../assets/icons/letter.svg?react';
import LetterNoti from '../../assets/icons/letter-noti.svg?react';
import Bubble from '../../assets/icons/bubble.svg?react';
import BubbleNoti from '../../assets/icons/bubble-noti.svg?react';
import More from '../../assets/icons/more-fill.svg?react';
import Close from '../../assets/icons/close-m.svg?react';

const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 12px 20px 12px 20px;
  justify-content: space-between;
  align-items: center;
  background: transparent;
`;

const LeftGroup = styled.div`
  display: flex;
  width: 64px;
  height: 32px;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const TextArea = styled.div`
  display: flex;
  height: 32px;
  justify-content: center;
  align-items: center;
  flex: 1 0 0;
`;

const Title = styled.span`
  height: 28px;
  color: ${(props) => props.theme.colors.gray900};
  ${(props) => props.theme.typography.h3}
`;

const iconMap = {
  'bell': <Bell />,
  'bell-noti': <BellNoti />,
  'letter': <Letter />,
  'letter-noti': <LetterNoti />,
  'bubble': <Bubble />,
  'bubble-noti': <BubbleNoti />,
  'more': <More />,
};

const RightGroup = styled.div`
  display: flex;
  width: 64px;
  height: 32px;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const IconStyle = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: ${(props) => props.theme.colors.gray900};
  cursor: pointer;
`;

const leftIconMap = {
  'back': <Back />,
  'close': <Close />,
};

export default function Header({ title, leftIcon, onLeft, icons = [], onIconClick }) {
  return (
    <Container>
      <LeftGroup>
        {leftIcon && (
          <span 
            onClick={onLeft} 
            style={{ cursor: 'pointer', marginTop: leftIcon === 'back' ? '7px' : '0px' }}>
            {leftIconMap[leftIcon]}
          </span>
        )}
      </LeftGroup>

      <TextArea>
        <Title>{title}</Title>
      </TextArea>

      <RightGroup>
        {icons.map((icon) => (
          <IconStyle key={icon} onClick={() => onIconClick && onIconClick(icon)}>
            {iconMap[icon]}
          </IconStyle>
        ))}
      </RightGroup>
    </Container>
  );
}
import styled from 'styled-components';
import Bell from '../../assets/icons/bell-line.svg?react';
import BellNoti from '../../assets/icons/bell-noti.svg?react';
import Letter from '../../assets/icons/letter.svg?react';
import LetterNoti from '../../assets/icons/letter-noti.svg?react';
import Bubble from '../../assets/icons/bubble.svg?react';
import BubbleNoti from '../../assets/icons/bubble-noti.svg?react';
import More from '../../assets/icons/more-fill.svg?react';

const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 12px 20px 12px 20px;
  justify-content: space-between;
  align-items: center;
  background: transparent;
`;

const TextArea = styled.div`
  display: flex;
  height: 32px;
  padding-left: 12px;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
`;

const Title = styled.span`
  height: 28px;
  color: ${(props) => props.theme.colors.gray900};
  ${(props) => props.theme.typography.h3}
`;

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

const iconMap = {
  'bell': <Bell />,
  'bell-noti': <BellNoti />,
  'letter': <Letter />,
  'letter-noti': <LetterNoti />,
  'bubble': <Bubble />,
  'bubble-noti': <BubbleNoti />,
  'more': <More />,
};

export default function Header2({ title, icons = [], onIconClick }) {
  return (
    <Container>
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
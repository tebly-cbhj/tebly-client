import styled from 'styled-components';

// 버튼의 바깥 원
const RadioOuter = styled.div`
  width: 24px;
  height: 24px;
  aspect-ratio: 1/1;

  border-radius: 24px;
  border: 2px solid ${(props) => props.$selected
    ? props.theme.colors.primary30
    : props.theme.colors.gray300};      //클릭 되면 primary30, 안되면 gray300
  background: ${(props) => props.theme.colors.gray100};

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
`;

// 버튼의 내부 원
const RadioInner = styled.div`
  width: 14px;
  height: 14px;
  aspect-ratio: 1/1;

  border-radius: 14px;
  background: ${(props) => props.theme.colors.primary100};

  opacity: ${(props) => props.$selected ? 1 : 0};
  transition: opacity 0.2s ease;
`;

export default function RadioBtn({ selected, onToggle }) {
  return (
    <RadioOuter $selected={selected} onClick={onToggle}>
      <RadioInner $selected={selected} />
    </RadioOuter>
  );
}
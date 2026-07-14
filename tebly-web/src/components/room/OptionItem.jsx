import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 21.875rem;
  padding: 1rem 0;
  justify-content: ${({ $selected }) => $selected ? 'space-between' : 'flex-start'};
  align-items: center;
  gap: ${({ $selected }) => $selected ? '0' : '4.375rem'};
  cursor: pointer;
`;

const Label = styled.span`
  font-family: 'Pretendard Variable';
  font-size: 1rem;
  font-style: normal;
  font-weight: ${({ $selected }) => $selected ? 600 : 400};
  line-height: 140%;
  letter-spacing: -0.025rem;
  color: ${({ $selected, theme }) => $selected ? theme.colors.gray900 : theme.colors.gray500};
  text-align: center;
`;

const IconWrapper = styled.div`
  display: flex;
  width: 1.5rem;
  padding: 0.4375rem 0.1875rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
  flex-shrink: 0;
`;

const CheckSvg = styled.svg`
  width: 1.125rem;
  height: 0.625rem;
`;

export default function OptionItem({ text, selected = false, onClick }) {
  return (
    <Container $selected={selected} onClick={onClick}>
      <Label $selected={selected}>{text}</Label>
      <IconWrapper>
        <CheckSvg viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ visibility: selected ? 'visible' : 'hidden' }}>
          <path d="M1 5L7 11L19 1" stroke="#34BAA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </CheckSvg>
      </IconWrapper>
    </Container>
  );
}

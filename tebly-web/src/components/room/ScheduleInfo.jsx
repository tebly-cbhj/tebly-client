import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 390px;
  padding: 0 20px;
  align-items: center;
  gap: 16px;
  box-sizing: border-box;
`;

const ImageBox = styled.div`
  width: 80px;
  height: 80px;
  flex-shrink: 0;

  svg {
    width: 80px;
    height: 80px;
    display: block;
  }
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 10px;
`;

const Title = styled.h2`
  margin: 0;
  ${({ theme }) => theme.typography.h2};
  color: ${({ theme }) => theme.colors.gray900};
`;

const DateText = styled.p`
  margin: 0;
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray800};
`;

export default function ScheduleInfo({ title, date, time, CategoryImage }) {
  return (
    <Container>
      <ImageBox>
        {CategoryImage && <CategoryImage />}
      </ImageBox>

      <TextBox>
        <Title>{title}</Title>
        <DateText>{date} {time}</DateText>
      </TextBox>
    </Container>
  );
}
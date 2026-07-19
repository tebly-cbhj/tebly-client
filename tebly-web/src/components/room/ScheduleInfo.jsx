import styled from 'styled-components';
import EditSmallIcon from '../../assets/icons/edit-small.svg?react';

const Container = styled.div`
  display: flex;
  width: 100%;
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

const TimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export default function ScheduleInfo({ title, date, time, CategoryImage, isEditing, onEditTime }) {
  return (
    <Container>
      <ImageBox>
        {CategoryImage && <CategoryImage />}
      </ImageBox>

      <TextBox>
        <Title>{title}</Title>
        <TimeRow>
          <DateText>{date} {time}</DateText>
          {isEditing && (
            <EditSmallIcon style={{ cursor: 'pointer' }} onClick={onEditTime} />
          )}
        </TimeRow>
      </TextBox>
    </Container>
  );
}
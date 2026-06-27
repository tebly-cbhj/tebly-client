import styled from 'styled-components';

const Btn = styled.button`
  width: 76px;
  height: 72px;
  position: relative;
  border: none;
  padding: 0;
  cursor: pointer;
  background: transparent;
`;

const BgRed = styled.div`
  width: 76px;
  height: 72px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0.72;
  background: #e31818;
`;

const Label = styled.span`
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 16px;
  font-family: Pretendard;
  font-weight: 600;
  line-height: 22.4px;
`;

export default function ButtonDelete({ onClick }) {
  return (
    <Btn onClick={onClick}>
      <BgRed />
      <Label>삭제</Label>
    </Btn>
  );
}

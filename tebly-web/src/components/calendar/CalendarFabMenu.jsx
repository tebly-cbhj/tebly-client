import styled from 'styled-components';

const Menu = styled.div`
  width: 9.6875rem;
  padding: 1.25rem 1rem;
  background: #fefefe;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.12);
`;

const MenuItem = styled.button`
  align-self: stretch;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const Label = styled.span`
  flex: 1 1 0;
  color: rgba(0, 0, 0, 0.80);
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  text-align: left;
`;

function EditIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.0205 5.62109L18.556 9.15663L8.59764 19.115L4.93756 19.5798L5.06211 15.5795L15.0205 5.62109Z" stroke="#1A1A1A" strokeWidth="2" />
      <path d="M16.9355 3.70711C17.326 3.31658 17.9592 3.31658 18.3497 3.70711L20.471 5.82843C20.8615 6.21895 20.8615 6.85212 20.471 7.24264L18.3497 9.36396L14.8142 5.82843L16.9355 3.70711Z" stroke="#1A1A1A" strokeWidth="2" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9.81252C3 8.70796 3.89541 7.81254 4.99997 7.81252L7 7.81249L7.76356 5.66499C7.90531 5.26631 8.28264 5 8.70577 5H15.2942C15.7174 5 16.0947 5.26631 16.2364 5.66499L17 7.81249L19 7.81252C20.1046 7.81254 21 8.70796 21 9.81252V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V9.81252Z" stroke="#1A1A1A" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3" stroke="#1A1A1A" strokeWidth="2" />
    </svg>
  );
}

export default function CalendarFabMenu({ onDirectInput, onAiRecognition }) {
  return (
    <Menu>
      <MenuItem type="button" onClick={onDirectInput}>
        <EditIcon />
        <Label>직접 입력</Label>
      </MenuItem>
      <MenuItem type="button" onClick={onAiRecognition}>
        <CameraIcon />
        <Label>AI 이미지 인식</Label>
      </MenuItem>
    </Menu>
  );
}

import styled from 'styled-components';
import AddBtnIcon from '../../assets/icons/add_schedule.svg';

const StyledIconButton = styled.img`
  display: block;
  width: 56px;
  height: 56px;
  cursor: pointer;
`;

export default function AddBtn({ onClick }) {
  return (
    <StyledIconButton
      src={AddBtnIcon}
      alt="add"
      onClick={onClick}
    />
  );
}

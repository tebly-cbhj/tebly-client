import styled from 'styled-components';
import Checkbox from '../../assets/onboarding/checkbox.svg?react';
import CheckboxSelected from '../../assets/onboarding/checkbox-selected.svg?react';
import ChevronRightIcon from '../../assets/icons/chevron-right.svg?react';

const Row = styled.div`
  display: flex;
  width: 100%;
  max-width: 350px;
  justify-content: space-between;
  align-items: center;
`;

const LeftArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
`;

const Label = styled.span`
  ${({ $bold, theme }) => $bold ? theme.typography.s2 : theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray900};
`;

const CheckIconWrapper = styled.div`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
`;

const ChevronWrapper = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;

export default function CheckBoxRow({ label, checked, onChange, showChevron = true, bold = false }) {
  return (
    <Row>
      <LeftArea>
        <CheckIconWrapper onClick={onChange}>
          {checked
            ? <CheckboxSelected width={20} height={20} />
            : <Checkbox width={20} height={20} />
          }
        </CheckIconWrapper>
        <Label $bold={bold}>{label}</Label>
      </LeftArea>

      {showChevron && (
        <ChevronWrapper>
          <ChevronRightIcon width={24} height={24} />
        </ChevronWrapper>
      )}
    </Row>
  );
}
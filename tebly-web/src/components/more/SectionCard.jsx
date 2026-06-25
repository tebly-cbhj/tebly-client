import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  width: 100%;
  padding: 16px 20px 0 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white};
  box-sizing: border-box;
`;

const Title = styled.span`
  ${({ theme }) => theme.typography.S2};
  color: ${({ theme }) => theme.colors.gray900};
`;

export default function SectionCard({ title, children }) {
  return (
    <Card>
      <Title>{title}</Title>
      {children}
    </Card>
  );
}
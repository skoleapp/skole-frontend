import styled from 'styled-components';

export const StyledCard = styled.div`
  border-radius: 0.5rem;
  text-align: center;
  background-color: var(--white);
  margin: 0.5rem;
  display: flex;
  flex-direction: column !important;
  max-width: 18rem;
  margin: 0 auto;
  padding: 0.5rem;
  margin-top: 1rem;
  box-shadow: 0.1rem 0.1rem 1rem var(--black);
`;

export const Card: React.FC = ({ children }) => <StyledCard>{children}</StyledCard>;

import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from '../../redux';
import { MenuListItem } from '../atoms';

const StyledMenu = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: var(--primary);
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  text-align: center;

  ul {
    margin-right: 2rem;
  }
`;

export const Menu: React.FC = () => {
  const { menuOpen } = useSelector((state: State) => state.ui);

  return menuOpen ? (
    <StyledMenu>
      <ul>
        <MenuListItem href="/" text="home" />
        <MenuListItem href="/login" text="login" />
        <MenuListItem href="/register" text="register" />
        <MenuListItem href="/search" text="search" />
        <MenuListItem href="/account" text="account" />
        <MenuListItem href="/leave-feedback" text="leave feedback" />
      </ul>
    </StyledMenu>
  ) : null;
};

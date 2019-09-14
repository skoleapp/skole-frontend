import styled from 'styled-components';
import menuItems from '../../static/menu-items.json';
import { MenuListItem } from '../atoms';
import { Row } from '../containers';

const StyledMenuList = styled.div``;

export const DesktopMenuList: React.FC = () => (
  <StyledMenuList>
    <Row>
      {menuItems.map((m, i) => (
        <MenuListItem key={i} href={m.href}>
          {m.name}
        </MenuListItem>
      ))}
    </Row>
  </StyledMenuList>
);

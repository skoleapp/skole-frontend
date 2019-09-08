import Link from 'next/link';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { toggleMenu } from '../../redux';
import { Anchor } from './Anchor';

const StyledMenuListItem = styled.li`
  list-style: none;
  color: var(--white);
  font-size: 1.75rem;
  line-height: 1.5;

  &:hover {
    transform: var(--scale);
    transition: var(--transition);
  }

  a:hover {
    text-decoration: none !important;
    color: var(--black);
  }
`;

interface Props {
  href: string;
  text: string;
}

export const MenuListItem: React.FC<Props> = ({ href, text }) => {
  const dispatch = useDispatch();

  return (
    <StyledMenuListItem onClick={() => dispatch(toggleMenu())}>
      <Link href={href}>
        <Anchor variant="white">{text}</Anchor>
      </Link>
    </StyledMenuListItem>
  );
};

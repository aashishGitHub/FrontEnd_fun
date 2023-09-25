import styled from 'styled-components';

export const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  z-index: 1;
  background: ${props => props.theme.primary};
  height: 40px;
  width: 100%;
`;
export const HeaderLogoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
  align-items: center;
  height: 100%;
`;

export const HeaderLogo = styled.img`
  width: 80px;
`;
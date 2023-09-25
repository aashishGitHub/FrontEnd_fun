import React from 'react';
import { Link } from 'react-router-dom';
import {
    HeaderContainer,
    HeaderLogoContainer,
    HeaderLogo,
} from '../styles/Header.styles';
import logo from '../assets/trello-logo.png';

const Header = () => {
    return (
        <HeaderContainer>
            <HeaderLogoContainer>
                <Link to="/board">
                    <HeaderLogo alt='Trello logo' style={{ height: 'auto', width: '6em' }} src={logo} />
                </Link>
            </HeaderLogoContainer>
        </HeaderContainer>
    );
};
export default  Header;
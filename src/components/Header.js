import { Icon } from 'frontend-components'
import { NavigationItem } from './NavigationItem'
import { menuItems } from '../lib/menu-items'
import { navigate } from '@reach/router'
import BaseLogo from '../assets/images/logo.svg'
import React from 'react';
import styled, { css, down, th, up } from '@xstyled/styled-components'

const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  width: 100%;

  @media (min-width: 1600px) {
    width: 1500px;
  }

  ${down('md',
    css`
      justify-content: center;
    `
  )}
`

const Logo = styled(BaseLogo)`
  cursor: pointer;
  height: 20px;
`

const MenuIcon = styled.div`
  position: absolute;
  left: 24px;
  top: calc(50% - 6px);
  width: 24px;

  ${up('md',
    css`
      display: none;
    `
  )}
`;

const NavigationContainer = styled.div`
  display: flex;

  ${down('md',
    css`
      display: none;
    `
  )}
`

const Wrapper = styled.div`
  background-color: ${th('colors.white')};
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  height: 64px;
  justify-content: center;
  position: fixed;
  width: 100vw;
  z-index: 10;
  top: 0;
`

export const Header = ({ location, onToggleMenu }) => {
  return (
    <Wrapper>
      <Container>
        <MenuIcon onClick={onToggleMenu}><Icon name="menu"></Icon></MenuIcon>

        <Logo onClick={() => navigate('/')}/>

        <NavigationContainer>
          {menuItems.map(menuItem => <NavigationItem {...menuItem} location={location} /> )}
        </NavigationContainer>
      </Container>
    </Wrapper>
  )
}

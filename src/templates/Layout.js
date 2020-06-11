import { NavigationItem } from '../components/NavigationItem'
import { Header } from '../components/Header'
import { ThemeProvider, theme } from 'frontend-components'
import { menuItems } from '../lib/menu-items'
import React, { useState } from "react"
import styled, { createGlobalStyle, css, keyframes, up } from '@xstyled/styled-components'
import { Helmet } from 'react-helmet'

const slideLeft = keyframes`
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(25vw);
  }
`;

const Content = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px 0;

  ${up('lg',
    css`
      padding-bottom: 48px;
    `
  )}
`

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
  }
`

const Menu = styled.div`
  background-color: neutral1;
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 25vw;
  z-index: 1;

  ${up('md',
    css`
      display: none;
    `
  )}
`

const Wrapper = styled.div`
  animation: 0.5s 1 forwards ${props => css`${props.isMenuVisible ? slideLeft : ''}`};
  background-color: white;
  position: relative;
  z-index: 10;
`;

export const Layout = ({ children, location }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="PingThings' PredictiveGrid™ platform offers a time series database purpose built for industrial scale deployments of high rate sensors (1Khz+). It includes all the tools necessary to ingest, store, visualize, analyze, and perform machine learning or deep learning on your data."
        />
        <meta
          name="keywords"
          content="time series, TSDB, data analysis, machine learning, deep learning, AI, IoT, energy, DOE"
        />
        <title>NI4AI - National Infrastructure for AI on the Electric Grid</title>
        <link rel="canonical" href="https://blog.ni4ai.org/" />
      </Helmet>

      <GlobalStyle />

      <Menu isMenuVisible={isMenuVisible}>
        {menuItems.map(menuItem => <NavigationItem {...menuItem} location={location} /> )}
      </Menu>

      <Wrapper isMenuVisible={isMenuVisible}>
        <Header location={location} onToggleMenu={() => setIsMenuVisible(previousValue => !previousValue)} />

        <Content>
          {children}
        </Content>
      </Wrapper>
    </ThemeProvider>
  )
}

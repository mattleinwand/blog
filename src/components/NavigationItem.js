import { Navigation as BaseNavigation } from 'frontend-components'
import { get } from 'lodash'
import { navigate } from '@reach/router'
import React from 'react'
import styled from 'styled-components'

const Navigation = styled(BaseNavigation)`
  display: block;
`

export const NavigationItem = ({ label, path, location }) => {
  const onNavigate = route => {
    navigate(`${route}`)
  }

  const onEnter = (event, route) => {
    const code = event.keyCode || event.charCode

    if (code !== 13) {
      return
    }

    onNavigate(`${route}`)
  }

  return (
    <Navigation
      isActive={get(location, 'pathname').includes(path)}
      label={label}
      onClick={() => onNavigate(path)}
      onKeyDown={event => onEnter(event, path)}
    />
  )
}

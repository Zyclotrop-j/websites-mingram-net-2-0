import { createGlobalStyle } from 'styled-components'

export const ThemeAsCssAttr = createGlobalStyle`
:root {
    --primary-color-main: ${props => props?.theme?.palette.primary.main};
    --secondary-color-main: ${props => props?.theme?.palette.secondary.main};
    --primary-color-light: ${props => props?.theme?.palette.primary.light};
    --secondary-color-light: ${props => props?.theme?.palette.secondary.light};
    --primary-color-dark: ${props => props?.theme?.palette.primary.dark};
    --secondary-color-dark: ${props => props?.theme?.palette.secondary.dark};
  }
`;
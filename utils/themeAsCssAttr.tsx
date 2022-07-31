import { Global, css, keyframes } from '@emotion/react';
import { useTheme } from '@emotion/react'

export const ThemeAsCssAttr = ({ theme }) => {
  return <Global styles={css`
    :root {
      --primary-color-main: ${theme?.palette.primary.main};
      --secondary-color-main: ${theme?.palette.secondary.main};
      --primary-color-light: ${theme?.palette.primary.light};
      --secondary-color-light: ${theme?.palette.secondary.light};
      --primary-color-dark: ${theme?.palette.primary.dark};
      --secondary-color-dark: ${theme?.palette.secondary.dark};
    }
  `} />;
};
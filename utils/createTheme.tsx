import { createTheme as MUICreateTheme, ThemeOptions } from '@mui/material/styles';
import unset from "lodash/unset"; 

export function createTheme(data: { theme?: ThemeOptions, advanced?: boolean } | undefined): ReturnType<typeof MUICreateTheme> {
  console.log("theme incomming", data)
  const advThemeProps = ['theme.htmlFontSize', 'theme.palette.info.main', 'theme.palette.success.main', 'theme.palette.warning.main', 'theme.palette.error.main', 'theme.typography.h1.fontSize', 'theme.typography.fontSize', 'theme.typography.fontSize', 'theme.typography.fontSize', 'theme.typography.fontSize', 'theme.typography.fontSize', 'theme.typography.fontSize', 'theme.typography.fontSize', 'theme.typography.h1.fontWeight', 'theme.typography.h2.fontWeight', 'theme.typography.h3.fontWeight', 'theme.typography.h4.fontWeight', 'theme.typography.h5.fontWeight', 'theme.typography.h6.fontWeight', 'theme.typography.body1.fontWeight', 'theme.typography.body2.fontWeight', 'theme.typography.h1.fontStyle', 'theme.typography.h2.fontStyle', 'theme.typography.h3.fontStyle', 'theme.typography.h4.fontStyle', 'theme.typography.h5.fontStyle', 'theme.typography.h6.fontStyle', 'theme.typography.body1.fontStyle', 'theme.typography.body2.fontStyle', 'theme.typography.h1.textTransform', 'theme.typography.h2.textTransform', 'theme.typography.h3.textTransform', 'theme.typography.h4.textTransform', 'theme.typography.h5.textTransform', 'theme.typography.h6.textTransform', 'theme.typography.body1.textTransform', 'theme.typography.body2.textTransform', 'theme.transitions.duration.shortest', 'theme.transitions.duration.shorter', 'theme.transitions.duration.short', 'theme.transitions.duration.standard', 'theme.transitions.duration.complex', 'theme.transitions.duration.enteringScreen', 'theme.transitions.duration.leavingScreen', 'theme.direction', 'theme.shape.borderRadius', 'theme.typography.fontWeightLight', 'theme.typography.fontWeightRegular', 'theme.typography.fontWeightMedium', 'theme.typography.fontWeightBold'];
  if(!data?.advanced) {
    advThemeProps.forEach(prop => unset(data?.theme, prop));
  }
  const t = (data?.theme ?? {}) as ThemeOptions;
  const compiledtheme = MUICreateTheme(t);
  console.log("compiledtheme", compiledtheme)
  return compiledtheme;
}

import { cellPlugins } from '../plugins/cellPlugins';

import Editor from '@react-page/editor';
import React from 'react';

import '@react-page/plugins-slate/lib/index.css';
import '@react-page/plugins-image/lib/index.css';
import '@react-page/editor/lib/index.css';

import { ThemeAsCssAttr } from "../utils/themeAsCssAttr";
import { createTheme } from "../utils/createTheme";

const content = "PAGE_CONTENT";

const theme = createTheme({ theme: "PAGE_THEME", advanced: "ADVANCED_THEME" });

// CssBaseline ??

export default function ReadOnlyExample() {
  // you would usually load SAMPLE_CONTENT from some api / endpoint / database
  return (<>
      <ThemeAsCssAttr theme={theme} />
      <Editor uiTheme={theme} value={content} cellPlugins={cellPlugins} readOnly />
    </>);
}

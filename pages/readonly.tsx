import { cellPlugins } from '../plugins/cellPlugins';

import Editor from '@react-page/editor';
import React from 'react';
import { createTheme } from '@mui/material/styles';

import '@react-page/plugins-slate/lib/index.css';
import '@react-page/plugins-image/lib/index.css';
import '@react-page/editor/lib/index.css';

const content = "PAGE_CONTENT";

const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: red[500],
    },
  },
  typography: {
    h1: {
      fontSize: '6rem',
    },
  },
  // TODO add value from site here!!!
});

export default function ReadOnlyExample() {
  // you would usually load SAMPLE_CONTENT from some api / endpoint / database
  return (
      <Editor uiTheme={theme} value={content} cellPlugins={cellPlugins} readOnly />
  );
}

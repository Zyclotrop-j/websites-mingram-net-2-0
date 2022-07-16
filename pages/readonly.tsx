import { cellPlugins } from '../plugins/cellPlugins';

import Editor from '@react-page/editor';
import React from 'react'; 

import '@react-page/plugins-slate/lib/index.css';
import '@react-page/plugins-image/lib/index.css';
import '@react-page/editor/lib/index.css';

const content = "PAGE_CONTENT";

export default function ReadOnlyExample() {
  // you would usually load SAMPLE_CONTENT from some api / endpoint / database
  return (
      <Editor value={content} cellPlugins={cellPlugins} readOnly />
  );
}

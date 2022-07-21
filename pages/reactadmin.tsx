/* eslint-disable @typescript-eslint/no-explicit-any */
import '../utils/styles';

import {
  DEFAULT_SLATE_PLUGIN_ID,
} from '@react-page/plugins-slate';
import dynamic from 'next/dynamic';
import React from 'react';
import { cellPlugins } from '../plugins/cellPlugins';
import {
  StylesProvider,
} from '@material-ui/core/styles';
import '@react-page/editor/lib/index.css';
import '@react-page/plugins-slate/lib/index.css';
import '@react-page/plugins-image/lib/index.css';

import { generateClassName } from '../utils/generateClassName';
// import { customSlate } from '../plugins/slatePluginLinkFromReactAdminSource';
// import { recommendedProducts } from '../plugins/slatePluginProductFromReactAdminSource';

export const ourCellPlugins = [
  ...cellPlugins,
];

const DynamicAdminComponent = dynamic(
  () => import("../utils/AdminComponent"),
  { ssr: false }
)

const App = () => {

  return (<StylesProvider generateClassName={generateClassName}>
    <DynamicAdminComponent />
  </StylesProvider>);

}

// https://github.com/EventSource/eventsource for /sse path (this one allows headers)

export default function ReactAdminExample() {
  return (
      <App />
    );
}

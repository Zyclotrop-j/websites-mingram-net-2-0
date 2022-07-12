/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  DEFAULT_SLATE_PLUGIN_ID,
} from '@react-page/plugins-slate';
import dynamic from 'next/dynamic';
import React from 'react';
import { cellPlugins } from '../plugins/cellPlugins';
import {
  StylesProvider,
} from '@material-ui/core/styles';


//import LoginPage from "../components/LoginForm";
import { generateClassName } from '../utils/generateClassName';
// import { dataProvider } from '../utils/dataProvider';
import { customSlate } from '../plugins/slatePluginLinkFromReactAdminSource';
import { recommendedProducts } from '../plugins/slatePluginProductFromReactAdminSource';

export const ourCellPlugins = [
  customSlate,
  recommendedProducts,
  ...cellPlugins.filter((p) => p.id !== DEFAULT_SLATE_PLUGIN_ID),
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

export default function ReactAdminExample() {
  return (
      <App />
    );
}

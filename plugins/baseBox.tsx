import dynamic from 'next/dynamic';
import React from 'react';
import type { CSSProperties } from 'react';
import { defaultSlate } from './slate';
import { cellPlugins } from"./cellPlugins"; 
import gridArea from "../utils/gridArea";

import { BaseBox, schema } from "../components/Widget/BaseBox";

const baseBox = {
  Renderer: ({ data, children }) => <BaseBox children={children} {...data} />,
  id: 'basebox',
  title: 'Simple Box',
  description: 'A simple box',
  version: 1,
  /*cellPlugins: (plugins) => plugins,
  createInitialChildren: () => {
    return [
      [
        {
          plugin: defaultSlate,
        }
      ],
    ];
  },*/
  cellStyle: (data): CSSProperties => {
    const styles = {
      padding: '0px',
      borderWidth: '0px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      ...data,
      boxSizing: 'border-box',
      display: 'block',
      filter: data.invert ? 'invert(100%)' : '',
      backgroundColor: 'inherit',
      outline: 'var(--s-5) solid transparent',
      outlineOffset: 'calc(var(--s-5) * -1)'
    };
    return styles;
  },
  controls: {
    type: 'autoform',
    schema: {
      properties: {
        ...gridArea,
        ...schema.properties
      },
      required: schema.required || [],
    },
  },
};
export default baseBox;

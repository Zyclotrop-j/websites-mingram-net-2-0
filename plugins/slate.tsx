import slate from '@react-page/plugins-slate';
import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import styled from 'styled-components';
import customSlatePlugin from './customSlatePlugin';
import katexSlatePlugin from './katexSlatePlugin';

import { useTheme } from '@mui/material/styles';


const mapToTypographyFacotory = (varient: string | undefined, other = {}) => d => {
  return {
    ...d,
    Component: (props) => {
      return (<Typography variant={varient} sx={props.style} {...props.attributes} {...other}>
          {props.children}
      </Typography>);
    },
  };
};

// you can further customize slate to your needs
export const defaultSlate = slate((def) => ({
  ...def,
  name: def.id + '/reduced', // you have to give it some other name
  // hideInMenu: true, // don't show in insert menu, we only use it as intial children
  plugins: {
    // this will pull in all predefined plugins
    ...def.plugins,
    // you can also add custom plugins. The namespace `custom` is just for organizing plugins
    custom: {
      //custom1: customSlatePlugin,
      //katex: katexSlatePlugin,
    },
    // here we do not use all plugins, but select them
    headings: {
      h1: def.plugins.headings.h1(mapToTypographyFacotory('h1')),
      h2: def.plugins.headings.h2(mapToTypographyFacotory('h2')),
      h3: def.plugins.headings.h3(mapToTypographyFacotory('h3')),
      h4: def.plugins.headings.h4(mapToTypographyFacotory('h4')),
      h5: def.plugins.headings.h5(mapToTypographyFacotory('h5')),
      h6: def.plugins.headings.h6(mapToTypographyFacotory('h6')),
    },
    paragraphs: {
      paragraph: def.plugins.paragraphs.paragraph(mapToTypographyFacotory('body1')),
      pre: def.plugins.paragraphs.pre(mapToTypographyFacotory(undefined, { component: 'pre' })),
    },
    link: {
      anchor: def.plugins.link.anchor(d => d),
      link: def.plugins.link.link(d => ({
        ...d,
        Component: (props) => {
          return (<Link variant='inherit' sx={props.style} {...props.attributes}>
              {props.children}
          </Link>);
        },
      }))
    },
    lists: {/* createSimpleHtmlBlockPlugin */},
    quotes: {},
    code: {
      mark: def.plugins.code.mark(d=>d),
      // block
    },
    emphasize: def.plugins.emphasize,
    // em strong underline
    alignment: def.plugins.alignment,
  },
}));
export const customizedSlate = defaultSlate;

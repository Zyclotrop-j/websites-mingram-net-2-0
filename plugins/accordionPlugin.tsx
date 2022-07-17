import React from 'react';
import { Accordion, AccordionItemWidget } from "../components/Widget/Accordion";
import { defaultSlate, customizedSlate } from './slate';
import { cellPlugins } from"./cellPlugins"; 

const customAccordionItemPlugin = {
  Renderer: ({ children, ...props }) => {
    const data = {};
    return (
      <AccordionItemWidget _id={props.data?.id ?? props.nodeId} {...props} {...data}>
        {children}
      </AccordionItemWidget>
    );
  },
  allowClickInside: true,
  cellPlugins: (plugins) => [
    ...cellPlugins
  ],
  createInitialChildren: () => {
    return [
      [
        {
          plugin: customizedSlate,
        }
      ],
      [
        {
          plugin: customizedSlate,
        },
        {
          plugin: customizedSlate,
        },
      ],
    ];
  },

  id: 'custom-AccordionItem-plugin',
  title: 'Custom AccordionItem plugin',
  description: 'Some custom AccordionItem plugin',
  version: 1,
  controls: {
    type: 'autoform',
    schema: {
      required: [ 'heading', 'preExpanded' ],
      properties: {
        heading: { type: 'string' },
        level: { type: 'number' },
        id: { type: 'string' },
      } 
    },
  },
};

const customAccordionPlugin = {
  Renderer: ({ children, data }) => (
    <Accordion {...data}>
      {children}
    </Accordion>
  ),
  cellPlugins: (plugins) => [
    customAccordionItemPlugin
  ],
  createInitialChildren: () => {
    return [
      [
        {
          plugin: customAccordionItemPlugin,
        }
      ],
      [
        {
          plugin: customAccordionItemPlugin,
        },
      ],
    ];
  },

  id: 'custom-accordion-plugin',
  title: 'Custom accordion plugin',
  description: 'Some custom accordion plugin',
  version: 1,
  controls: {
    type: 'autoform',
    schema: {
      required: ['allowMultipleExpanded', 'allowZeroExpanded', 'level', 'preExpanded'],
      properties: {
        allowMultipleExpanded: { type: 'boolean' },
        allowZeroExpanded: { type: 'boolean' },
        level: { type: 'number' },
        preExpanded: { type: 'array', items: { type: 'string' } }
      },
    },
  },
};

export default customAccordionPlugin;

import { ColorPickerField } from '@react-page/editor';
import React from 'react';


const getTextColor = (palette) => {
  if (palette?.variant === 'custom') {
    return palette.customTextColor;
  }
  if (palette?.variant === 'highlight') {
    return 'white';
  }
  return 'black';
};
const getBackgroundColor = (palette) => {
  if (palette?.variant === 'custom') {
    return palette.customBackgroundColor;
  }
  if (palette?.variant === 'highlight') {
    return '#3f51b5';
  }
  return 'white';
};
const customContentPlugin = {
  Renderer: ({ data }) => (
    <div
      style={{
        backgroundColor: getBackgroundColor(data?.style?.pallete),
        color: getTextColor(data?.style?.pallete),
        padding: data?.style?.padding,
      }}
    >
      <h3>{data.title}</h3>
      <p>Firstname: {data.firstName}</p>
      <p>Lastname: {data.lastName}</p>
      <p>Age: {data.age}</p>
    </div>
  ),
  id: 'custom-content-plugin',
  title: 'Custom content plugin',
  description: 'Some custom content plugin with multiple controls',
  version: 1,
  controls: [
    {
      title: 'Default config',
      controls: {
        type: 'autoform',
        schema: {
          properties: {
            title: {
              type: 'string',
              default:
                'I am a custom plugin with multiple controls, this is my configuration',
            },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            age: {
              title: 'Age in years',
              type: 'integer',
              minimum: 0,
            },
          },
          required: ['firstName', 'lastName'],
        },
      },
    },
    {
      title: 'Styling',
      controls: {
        type: 'autoform',
        schema: {
          type: 'object',
          required: [],
          properties: {
            style: {
              type: 'object',
              required: [],

              properties: {
                pallete: {
                  type: 'object',
                  properties: {
                    variant: {
                      type: 'string',
                      enum: ['default', 'highlight', 'custom'],
                    },
                    customBackgroundColor: {
                      type: 'string',
                      default: 'white',
                      uniforms: {
                        component: ColorPickerField,
                        showIf: (data) =>
                          data.style?.pallete?.variant === 'custom',
                      },
                    },
                    customTextColor: {
                      type: 'string',
                      default: 'black',
                      uniforms: {
                        component: ColorPickerField,
                        showIf: (data) =>
                          data.style?.pallete?.variant === 'custom',
                      },
                    },
                  },
                },

                padding: {
                  type: 'number',
                  default: 10,
                },
              },
            },
          },
        },
      },
    },
  ],
};
export default customContentPlugin;

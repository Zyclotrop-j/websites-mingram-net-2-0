
import React from "react";
import { useTheme } from '@mui/material/styles';
import Select, { StylesConfig } from 'react-select';
import chroma from 'chroma-js';
import TextField from '@mui/material/TextField';
import { connectField } from 'uniforms';

export interface ColourOption {
    readonly value: string;
    readonly label: string;
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
  }


const dot = (color = 'transparent') => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: 10,
    width: 10,
  },
});
const colourStyles: StylesConfig<ColourOption> = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'lightgray',
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',
  
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        },
      };
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot('#ccc') }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };
  
const ColorSelect = (props) => (
    <Select
        styles={colourStyles}
        {...props}
    />
);

const identity = i => i;
const combine = (options, useOptionOutput) => [...useOptionOutput, ...options];
function SelectOrColor(options = [], useOptions = identity, combineOptions = combine) {
    return connectField((props) => {
        const { onChange, value, label, description } = props;
        const op1 = useOptions();
        const combinedOptions = combineOptions(options, op1)
        return (
            <label>
              <p>{label}</p>
              <p>{description}</p>
              <ColorSelect
                onChange={v => {onChange(v.value);}}
                value={combinedOptions.find(({value: v}) => value === v) ?? {value, label: `Custom value ${value}`}}
                defaultValue={combinedOptions[0]}
                options={combinedOptions}
              />
              <br />
              <TextField label="css-color string" variant="outlined" onChange={v => {onChange(v.target.value);}} value={value} />
            </label>
          );
    })
  }

export const ColorInput = {
    uniforms: {
        component: SelectOrColor([
            { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true }, // todo: get more colors here
        ], () => {
            const theme = useTheme();
            return [
                { value: theme.palette.primary.main, label: 'Primary', color: theme.palette.primary.main },
                { value: theme.palette.primary.light, label: 'Primary light', color: theme.palette.primary.light },
                { value: theme.palette.primary.dark, label: 'Primary dark', color: theme.palette.primary.dark },
                { value: theme.palette.secondary.main, label: 'Secondary', color: theme.palette.secondary.main, },
                { value: theme.palette.secondary.light, label: 'Secondary light', color: theme.palette.secondary.light, },
                { value: theme.palette.secondary.dark, label: 'Secondary dark', color: theme.palette.secondary.dark, },

                { value: theme.palette.error.main, label: 'Error', color: theme.palette.error.main, },
                { value: theme.palette.error.light, label: 'Error light', color: theme.palette.error.light, },
                { value: theme.palette.error.dark, label: 'Error dark', color: theme.palette.error.dark, },

                { value: theme.palette.warning.main, label: 'Warning', color: theme.palette.warning.main, },
                { value: theme.palette.warning.light, label: 'Warning light', color: theme.palette.warning.light, },
                { value: theme.palette.warning.dark, label: 'Warning dark', color: theme.palette.warning.dark, },

                { value: theme.palette.info.main, label: 'Info', color: theme.palette.info.main, },
                { value: theme.palette.info.light, label: 'Info light', color: theme.palette.info.light, },
                { value: theme.palette.info.dark, label: 'Info dark', color: theme.palette.info.dark, },

                { value: theme.palette.success.main, label: 'Success', color: theme.palette.success.main, },
                { value: theme.palette.success.light, label: 'Success light', color: theme.palette.success.light, },
                { value: theme.palette.success.dark, label: 'Success dark', color: theme.palette.success.dark, },

                { value: theme.palette.text.primary, label: 'Primary txt', color: theme.palette.text.primary, },
                { value: theme.palette.text.secondary, label: 'Secondary Text', color: theme.palette.text.secondary, },

                { value: theme.palette.common.black, label: 'Black', color: theme.palette.common.black, },
                { value: theme.palette.common.white, label: 'White', color: theme.palette.common.white, },
            ];

        })
    },
};

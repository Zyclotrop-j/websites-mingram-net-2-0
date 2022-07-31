
import React, { useState } from "react";
import { useTheme } from '@mui/material/styles';
import styled from '@emotion/styled';
import Select, { StylesConfig, createFilter } from 'react-select';
import chroma from 'chroma-js';
import TextField from '@mui/material/TextField';
import { connectField } from 'uniforms';
import * as ReactColor from 'react-color';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import groupBy from "lodash/groupBy";
import Slider from '@mui/material/Slider';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';

/*
<ColorSelect
                id={id}
                onChange={v => {onChange(v.value);}}
                value={currentValueThemeColor ?? {value, label: `Custom value ${value}`}}
                defaultValue={combinedOptions[0]}
                options={combinedOptions}
              />
  lineHeights: {
    normal: "normal",
    none: 1,
    shorter: 1.25,
    short: 1.375,
    base: 1.5,
    tall: 1.625,
    taller: "2",
    "3": ".75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "7": "1.75rem",
    "8": "2rem",
    "9": "2.25rem",
    "10": "2.5rem",
  },
  letterSpacings: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },

  radii: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
*/
const unset = { unset: {value: "var(--unset)", label: "no value set", group: "Basic"} }
const spaces = {
  's0': { value: "var(--s0)", label: "Baseline value of 1rem", group: "Basic" },
  
  's1': { value: "var(--s1)", label: "1.5rem", group: "Exponential" },
  's2': { value: "var(--s2)", label: "2.25rem", group: "Exponential" },
  's3': { value: "var(--s3)", label: "3.375rem", group: "Exponential" },
  's4': { value: "var(--s4)", label: "5.0625rem", group: "Exponential" },
  's5': { value: "var(--s5)", label: "7.59375rem", group: "Exponential" },
  's-1': { value: "var(--s-1)", label: "0.1316rem", group: "Exponential" },
  's-2': { value: "var(--s-2)", label: "0.1975rem", group: "Exponential" },
  's-3': { value: "var(--s-3)", label: "0.2962rem", group: "Exponential" },
  's-4': { value: "var(--s-4)", label: "0.4444rem", group: "Exponential" },
  's-5': { value: "var(--s-5)", label: "0.6666rem", group: "Exponential" },

  '1px': { value: "1px", label: "1px", group: "Basic"  },

  'L0.5': { value: 'var(--L05)', label: '0.125rem', group: "Linear" },
  'L1': { value: 'var(--L1)', label: '0.25rem', group: "Linear" },
  'L1.5': { value: 'var(--L15)', label: '0.375rem', group: "Linear" },
  'L2': { value: 'var(--L2)', label: '0.5rem', group: "Linear" },
  'L2.5': { value: 'var(--L25)', label: '0.625rem', group: "Linear" },
  'L3': { value: 'var(--L3)', label: '0.75rem', group: "Linear" },
  'L3.5': { value: 'var(--L35)', label: '0.875rem', group: "Linear" },
  'L4':{ value:  'var(--L4)', label:  '1rem', group: "Linear" },
  'L5': { value: 'var(--L5)', label: '1.25rem', group: "Linear" },
  'L6': { value: 'var(--L6)', label: '1.5rem', group: "Linear" },
  'L7': { value: 'var(--L7)', label: '1.75rem', group: "Linear" },
  'L8':{ value:  'var(--L8)', label:  '2rem', group: "Linear" },
  'L9': { value: 'var(--L9)', label: '2.25rem', group: "Linear" },
  'L10': { value: 'var(--L10)', label: '2.5rem', group: "Linear" },
  'L12':{ value:  'var(--L12)', label:  '3rem', group: "Linear" },
  'L14': { value: 'var(--L14)', label: '3.5rem', group: "Linear" },
  'L16':{ value:  'var(--L16)', label:  '4rem', group: "Linear" },
  'L20':{ value:  'var(--L20)', label:  '5rem', group: "Linear" },
  'L24':{ value:  'var(--L24)', label:  '6rem', group: "Linear" },
  'L28':{ value:  'var(--L28)', label:  '7rem', group: "Linear" },
  'L32':{ value:  'var(--L32)', label:  '8rem', group: "Linear" },
}
const lines = {
  'P0.5': { value: 'var(--P0.5)', label: '0.5em', group: "Parent" },
  'P1.0': { value: 'var(--P1.0)', label: '1.0em', group: "Parent" },
  'P1.5': { value: 'var(--P1.5)', label: '1.5em', group: "Parent" },
  'P2.0': { value: 'var(--P2.0)', label: '2.0em', group: "Parent" },
  'P2.5': { value: 'var(--P2.5)', label: '2.5em', group: "Parent" },
  'P3.0': { value: 'var(--P3.0)', label: '3.0em', group: "Parent" },
  'P3.5': { value: 'var(--P3.5)', label: '3.5em', group: "Parent" },
  'P4.0': { value: 'var(--P4.0)', label: '4.0em', group: "Parent" },
  'P5.0': { value: 'var(--P5.0)', label: '5.0em', group: "Parent" },
  'P6.0': { value: 'var(--P6.0)', label: '6.0em', group: "Parent" },
  'P7.0': { value: 'var(--P7.0)', label: '7.0em', group: "Parent" },
  'P8.0': { value: 'var(--P8.0)', label: '8.0em', group: "Parent" },
  'P9.0': { value: 'var(--P9.0)', label: '9.0em', group: "Parent" },
  'P10.0': { value: 'var(--P10.0)', label: '10.0em', group: "Parent" },
  'P12.0': { value: 'var(--P12.0)', label: '12.0em', group: "Parent" },

};
const sizes = {
  ...unset,
  ...spaces,
  max: { value: 'var(--max)', label: 'intrinsic maximum width', group: "Basic" },
  min: { value: 'var(--min)', label: 'intrinsic minimum width', group: "Basic" },
  full: { value: 'var(--full)', label: '100%', group: "Basic" },
  '3xs': { value: 'var(--n3xs)', label: '14rem', group: "T-Shirt" },
  '2xs': { value: 'var(--n2xs)', label: '16rem', group: "T-Shirt" },
  xs: { value: 'var(--xs)', label: '20rem', group: "T-Shirt" },
  sm: { value: 'var(--sm)', label: '24rem', group: "T-Shirt" },
  md: { value: 'var(--md)', label: '28rem', group: "T-Shirt" },
  lg: { value: 'var(--lg)', label: '32rem', group: "T-Shirt" },
  xl: { value: 'var(--xl)', label: '36rem', group: "T-Shirt" },
  '2xl': { value: 'var(--n2xl)', label: '42rem', group: "T-Shirt" },
  '3xl': { value: 'var(--n3xl)', label: '48rem', group: "T-Shirt" },
  '4xl': { value: 'var(--n4xl)', label: '56rem', group: "T-Shirt" },
  '5xl': { value: 'var(--n5xl)', label: '64rem', group: "T-Shirt" },
  '6xl': { value: 'var(--n6xl)', label: '72rem', group: "T-Shirt" },
  '7xl': { value: 'var(--n7xl)', label: '80rem', group: "T-Shirt" },
  '8xl': { value: 'var(--n8xl)', label: '90rem', group: "T-Shirt" },
  'container-sm': { value: 'var(--container-sm)', label: 'Small mobile (640px)', group: "Container" },
  'container-md': { value: 'var(--container-md)', label: 'Large mobile (768px)', group: "Container" },
  'container-lg': { value: 'var(--container-lg)', label: 'Table (1024px)', group: "Container" },
  'container-xl': { value: 'var(--container-xl)', label: 'Desktop (1280px)', group: "Container" },
  'L36':{ value:  'var(--L36)', label:  '9rem', group: "Linear" },
  'L40':{ value:  'var(--L40)', label:  '10rem', group: "Linear" },
  'L44':{ value:  'var(--L44)', label:  '11rem', group: "Linear" },
  'L48':{ value:  'var(--L48)', label:  '12rem', group: "Linear" },
  'L52':{ value:  'var(--L52)', label:  '13rem', group: "Linear" },
  'L56':{ value:  'var(--L56)', label:  '14rem', group: "Linear" },
  'L60':{ value:  'var(--L60)', label:  '15rem', group: "Linear" },
  'L64':{ value:  'var(--L64)', label:  '16rem', group: "Linear" },
  'L72':{ value:  'var(--L72)', label:  '18rem', group: "Linear" },
  'L80':{ value:  'var(--L80)', label:  '20rem', group: "Linear" },
  'L96':{ value:  'var(--L96)', label:  '24rem', group: "Linear" },
  'measure': { value: "var(--measure)", label: "60ch", group: "Basic" },
  'P14.0': { value: 'var(--P140)', label: '14.0em', group: "Parent" },
  'P16.0': { value: 'var(--P160)', label: '16.0em', group: "Parent" },
  'P20.0': { value: 'var(--P200)', label: '20.0em', group: "Parent" },
  'P24.0': { value: 'var(--P240)', label: '24.0em', group: "Parent" },
  'P28.0': { value: 'var(--P280)', label: '28.0em', group: "Parent" },
  'P32.0': { value: 'var(--P320)', label: '32.0em', group: "Parent" },
  'P36.0': { value: 'var(--P360)', label: '36.0em', group: "Parent" },
  'P40.0': { value: 'var(--P400)', label: '40.0em', group: "Parent" },
  'P44.0': { value: 'var(--P440)', label: '44.0em', group: "Parent" },
  'P48.0': { value: 'var(--P480)', label: '48.0em', group: "Parent" },
  'P52.0': { value: 'var(--P520)', label: '52.0em', group: "Parent" },
  'P56.0': { value: 'var(--P560)', label: '56.0em', group: "Parent" },
  'P60.0': { value: 'var(--P600)', label: '60.0em', group: "Parent" },
  'P64.0': { value: 'var(--P640)', label: '64.0em', group: "Parent" },
  'P72.0': { value: 'var(--P720)', label: '72.0em', group: "Parent" },
  'P80.0': { value: 'var(--P800)', label: '80.0em', group: "Parent" },
  'P96.0': { value: 'var(--P960)', label: '96.0em', group: "Parent" },
};

const LeftRight = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  margin-top: 1rem;
`;

const filterConfig = {
  ignoreCase: true,
  ignoreAccents: true,
  trim: true,
  matchFrom: 'any'
};
function SelectOrSize(options, useCreateThemedSize) {
  return connectField((props) => {
      const { onChange, value, label, description, id } = props;
      const createThemedSize = useCreateThemedSize();
      const plainopts = Object.entries(options).map(([k, {value, label, group}]) => ({ value, label: `${k}: ${label}`, group }));
      const opts = Object.entries(
        groupBy(plainopts, item => item.group)
      ).map(([k, v]) => ({ label: k, options: v }));

      const currentFromList = plainopts.find(({value: v}) => value === v);
      const [isPresetUsed, setIsPresetUsed] = useState(true);

      return (
          <Paper>
            <LeftRight>
              <div style={{display: 'inline-block', paddingLeft: 10}}>
                <Tooltip title={description}>
                  <label htmlFor={id}>{label}</label>
                </Tooltip>
              </div>
              <Switch defaultChecked size="small" checked={isPresetUsed} onChange={() => setIsPresetUsed(!isPresetUsed)} />
            </LeftRight>
            <div>
              {isPresetUsed ?
              <Select
                defaultValue={plainopts[0]}
                isSearchable
                name={id}
                options={opts}
                filterOption={createFilter(filterConfig)}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={document.body}
                menuPlacement={'top'}
                id={id}
                onChange={v => {onChange(v.value);}}
                value={currentFromList ?? {value, label: `Custom value ${value}`}}
              /> :
              <TextField fullWidth size="small" id={id} label="Custom size" variant="outlined" />}
            </div>
            <div />
          </Paper>
        );
  })
}

export const SpaceInput = {
  uniforms: {
      component: SelectOrSize({...unset, ...spaces, ...lines}, () => {
          const theme = useTheme();
          return (num) => theme.spacing(num);
      })
  },
};
export const SizeInput = {
  uniforms: {
      component: SelectOrSize(sizes, () => {
          const theme = useTheme();
          return (num) => theme.spacing(num);
      })
  },
};



const SketchPicker = ReactColor[`SketchPicker`];
const CirclePicker = ReactColor[`CirclePicker`];
const NoShadowChild = styled.div`>*{box-shadow: none!important;}`;
const identity = i => i;
const combine = (options, useOptionOutput) => [...useOptionOutput, ...options];
function SelectOrColor(options = [], useOptions = identity, combineOptions = combine) {
    return connectField((props) => {
        const { onChange, value, label, description, id } = props;
        const op1 = useOptions();
        const combinedOptions = combineOptions(options, op1);
        const currentValueThemeColor = combinedOptions.find(({value: v}) => value === v);
        const [usesThemeColor, setThemeColor] = useState(!!currentValueThemeColor || value === "transparent");
        console.log(value);
        return (
            <Paper>
              <div style={{backgroundColor: value, width: 36, height: 36, display: 'inline-block', borderRadius: 20}}/>
              <div style={{display: 'inline-block', paddingLeft: 10}}>
                <label htmlFor={id}>{label}</label>
                <p>{description}</p>
              </div>
              <FormControlLabel control={<Switch defaultChecked />} label="Theme color" checked={usesThemeColor} onChange={() => setThemeColor(!usesThemeColor)} />
              {usesThemeColor ? <CirclePicker
                id={id}
                onChangeComplete={v => {onChange(`rgba(${v.rgb.r},${v.rgb.g},${v.rgb.b},${v.rgb.a})`);}}
                color={value}
                colors={combinedOptions.map(({color}) => color)}
              /> : <NoShadowChild><SketchPicker
                id={id}
                onChangeComplete={v => {onChange(`rgba(${v.rgb.r},${v.rgb.g},${v.rgb.b},${v.rgb.a})`);}}
                color={value}
                presetColors={combinedOptions.filter(({label}) => !label.includes(" ")).slice(0, 16).map(({ color, label: title}) => ({color, title}))}
              /></NoShadowChild>}
            </Paper>
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

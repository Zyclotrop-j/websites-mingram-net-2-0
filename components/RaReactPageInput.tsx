import { Paper } from '@mui/material';
import styled from '@emotion/styled';
import type { EditorProps } from '@react-page/editor';
import Editor from '@react-page/editor';
import React from 'react';
import { Labeled, useInput } from 'react-admin';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeAsCssAttr } from "../utils/themeAsCssAttr";

const OverflowDiv = styled.div``;

export type RaReactPageInputProps = {
  label?: string;
  source: string;
  style?: React.CSSProperties;
  muitheme: {};
} & EditorProps;
export const RaReactPageInput: React.FC<RaReactPageInputProps> = ({
  label = 'Content',
  source,
  style,
  muitheme,
  ...editorProps
}) => {
  const {
    input: { value: v, onChange: change },
  } = useInput({ source });
  const onChange = (vv) => {
    const json = JSON.stringify(vv); // we need to stringify - max-depth of firebase is 20, which we'll easily reach o.O
    const bytesize = new Blob([json]).size;
    const MAX_FIRESTORE_DOCUMETN_SIZE = 10e6; // 1MB max size - other properties, but this one will take neglitable space
    const percent = bytesize / MAX_FIRESTORE_DOCUMETN_SIZE * 100;
    console.log(`Website has a size of ${bytesize}bytes (${percent}% of max)`)
    return change(json);
  };
  let value = v;
  try {
    value = JSON.parse(value);
  } catch(e) {
    console.log(`Got invalid value for website`, v)
  }
  return (
    <Labeled label={label} source={source} fullWidth>
      <OverflowDiv>
          <ThemeAsCssAttr theme={muitheme} />
          <Editor value={value} uiTheme={muitheme} onChange={onChange} {...editorProps} />
      </OverflowDiv>
    </Labeled>
  );
};

export default RaReactPageInput;
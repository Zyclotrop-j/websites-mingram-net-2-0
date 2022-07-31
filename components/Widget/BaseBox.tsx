import React from 'react';
import styled from '@emotion/styled';
import { ColorInput, SpaceInput, SizeInput } from '../../utils/themeValueInputs';

export const uiSchema = {};

export const schema = {
  "title": "componentbasebox",
  "description": "A custom element for placing two elements side-by-side. If space permits, the sidebar element has a set width, and the companion takes up the rest of the available horizontal space. If not, the elements are collapsed into a single column, each taking up 100% of the horizontal space.",
  "type": "object",
  "properties": {
    "maxWidth": {
      "description": "A maximum width",
      "default": "unset",
      "type": "string",
      ...SizeInput,
    },
    "minWidth": {
      "description": "A minimum width",
      "default": "unset",
      "type": "string",
      ...SizeInput,
    },
    "width": {
      "description": "A designated width",
      "default": "auto",
      "type": "string",
      ...SizeInput,
    },
    "padding": {
      "description": "A CSS `padding` value",
      "default": "0px",
      "type": "string",
      ...SpaceInput,
    },
    "borderWidth": {
      "description": "A CSS `border-width` value",
      "default": "0px",
      "type": "string",
      ...SpaceInput,
    },
    "borderColor": {
      "description": "A CSS `border-color` value",
      "default": "transparent",
      "type": "string",
      ...ColorInput,
    },
    "invert": {
      "description": "Whether to apply an inverted theme. Only recommended for greyscale designs.",
      "default": false,
      "type": "boolean"
    }
  }
};

const BaseBaseBox = React.forwardRef((props, ref) => {
  const {
    children,
    className,
  } = props;
  return <div className={className} ref={ref}>{children}</div>
});
BaseBaseBox.defaultProps = {
  padding: "0px",
  borderWidth: "0px",
  invert: false,
  borderColor: "",
  maxWidth: "unset",
  minWidth: "unset",
  width: "auto"
};
export const BaseBox = styled(BaseBaseBox)``;
BaseBaseBox.defaultProps = BaseBox.defaultProps;

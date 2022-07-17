import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import {
    Accordion as XAccordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import LazyLoad , { forceCheck } from 'react-lazyload';

const fadein = keyframes`
  0% {
      opacity: 0;
  }

  100% {
      opacity: 1;
  }
`;
const StyledAccordion = styled(XAccordion)`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 2px;
`;
const StyledAccordionItem = styled(AccordionItem)`
  & + & {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;
const StyledAccordionItemHeading = styled(AccordionItemHeading)``;
const StyledAccordionItemButton = styled(AccordionItemButton)`
  background-color: #f4f4f4;
  color: #444;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  text-align: left;
  border: none;
  &:hover {
    background-color: #ddd;
  }
  &:before {
    display: inline-block;
    content: '';
    height: 10px;
    width: 10px;
    margin-right: 12px;
    border-bottom: 2px solid currentColor;
    border-right: 2px solid currentColor;
    transform: rotate(-45deg);
  }
  &[aria-expanded='true']::before,
  &[aria-selected='true']::before {
      transform: rotate(45deg);
  }
`;
const StyledAccordionItemPanel = styled(AccordionItemPanel)`
  padding: 20px;

  animation: ${fadein} 0.35s ease-in;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const AccordionItemWidget = ({ _id, data: { level, heading } = {}, children }) => {
  console.log('uuid', `${_id}`)
  return (<StyledAccordionItem
    uuid={`${_id}`}
    key={`${_id}`}
  >
      <StyledAccordionItemHeading
        aria-level={level}
      >
          <StyledAccordionItemButton>
              {heading || `Heading ${_id}`}
          </StyledAccordionItemButton>
      </StyledAccordionItemHeading>
      <StyledAccordionItemPanel>
          <LazyLoad once scroll={false} resize={false} overflow={false} placeholder={<div>Loading...</div>}>{children}</LazyLoad>
      </StyledAccordionItemPanel>
  </StyledAccordionItem>);
}

export class Accordion extends React.Component<any> {

  static defaultProps = {
    allowMultipleExpanded: false,
    allowZeroExpanded: false,
    preExpanded: [],
    level: 3,
  }

  public render() {

    const {
      _id,
      allowMultipleExpanded,
      allowZeroExpanded,
      level,
      preExpanded = [],
      children
    } = this.props;
    console.log('preExpanded', preExpanded)
    
    return (
        <StyledAccordion
          allowMultipleExpanded={allowMultipleExpanded}
          allowZeroExpanded={allowZeroExpanded}
          preExpanded={preExpanded}
          onChange={forceCheck}
        >
            {children}
        </StyledAccordion>
    );
  }
}

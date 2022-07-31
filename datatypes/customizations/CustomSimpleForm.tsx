import React, { Children } from 'react';
import {
  Toolbar,
  FormInput
} from 'react-admin';
import CardContent from '@material-ui/core/CardContent';
import { FormWithRedirect } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import styled from '@emotion/styled';

const useStyles = makeStyles(
  theme => ({
    root: {
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      '&:first-child': {
        paddingTop: 16,
      },
      '&:last-child': {
        paddingBottom: 16,
        [theme.breakpoints.only('xs')]: {
          paddingBottom: 70,
        },
      },
    },
  }),
  { name: 'RaCardContentInner' }
);
const CardContentInner = (props) => {
  const { className, children } = props;
  const classes = useStyles(props);
  return (
    <CardContent className={`${classes.root} ${className}`}>
      {children}
    </CardContent>
  );
};
const sanitizeRestProps = ({
  active, dirty, dirtyFields, dirtyFieldsSinceLastSubmit, dirtySinceLastSubmit, error, errors, form, hasSubmitErrors, hasValidationErrors, initialValues, modified = null, modifiedSinceLastSubmit, save = null, submitError, submitErrors, submitFailed, submitSucceeded, submitting, touched = null, valid, values, visited = null, __versions = null, ...props
}) => props;
const CustomSimpleFormView = ({
  basePath, children, className, component: Component, handleSubmit, handleSubmitWithRedirect, invalid, margin, mutationMode, pristine, record, redirect, resource, saving, submitOnEnter, toolbar, undoable, variant, validating, ...rest
}) => (
  <form
    className='simple-form'
    {...sanitizeRestProps(rest)}
  >
    {toolbar &&
      React.cloneElement(toolbar, {
        basePath,
        handleSubmitWithRedirect,
        handleSubmit,
        invalid,
        mutationMode,
        pristine,
        record,
        redirect,
        resource,
        saving,
        submitOnEnter,
        validating,
        undoable,
      })}
    <Component>
      {Children.map(
        children,
        (input) => input && (
          <FormInput
            basePath={basePath}
            input={input}
            record={record}
            resource={resource}
            variant={input.props.variant || variant}
            margin={input.props.margin || margin} />
        )
      )}
    </Component>
  </form>
);
const CustomToolbar = styled(Toolbar)`
  margin-top: 0;
  position: fixed;
  border-radius: 5px;
  z-index: 1;
  bottom: 0;
`;
CustomSimpleFormView.defaultProps = {
  submitOnEnter: true,
  toolbar: <CustomToolbar />,
  component: CardContentInner,
};
export const CustomSimpleForm = (props) => (
  <FormWithRedirect
    {...props}
    render={formProps => <CustomSimpleFormView {...formProps} />} />
);

import React, { useState, useCallback } from 'react';
import {
    Button,
    CardActions,
    CircularProgress,
    TextField,
} from '@material-ui/core';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Field, Form } from 'react-final-form';
import { useLogin } from 'react-admin';
import { useTranslate, useNotify, useSafeSetState } from 'ra-core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { passwordStrength } from "check-password-strength";




const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const useStyles = makeStyles(
    (theme: Theme) => ({
        form: {
            padding: '0 1em 1em 1em',
        },
        input: {
            marginTop: '1em',
        },
        button: {
            width: '100%',
        },
        icon: {
            marginRight: theme.spacing(1),
        },
    }),
    { name: 'RaLoginForm' }
);

const Input = ({
    meta: { touched, error }, // eslint-disable-line react/prop-types
    input: inputProps, // eslint-disable-line react/prop-types
    ...props
}) => (
    <TextField
        error={!!(touched && error)}
        helperText={touched && error}
        {...inputProps}
        {...props}
        fullWidth
    />
);
const PWInput = ({
    meta: { touched, error }, // eslint-disable-line react/prop-types
    input: inputProps, // eslint-disable-line react/prop-types
    ...props
}) => (
    <>
        <TextField
            error={!!(touched && error)}
            helperText={touched && error}
            {...inputProps}
            {...props}
            fullWidth
        />
        {touched && passwordStrength(inputProps?.value ?? '')?.value}
    </>
    
);
const Signup = (props) => {
    const { redirectTo } = props;
    const [loading, setLoading] = useSafeSetState(false);
    const translate = useTranslate();
    const notify = useNotify();
    const login = useLogin();

    const classes = useStyles(props);
    
    const submit = values => {
        setLoading(true);
        const auth = getAuth();
        const email = values.username;
        const password = values.password;
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            login(values, redirectTo);
        })
        .catch((error) => {
            setLoading(false);
            const errorCode = error.code;
            const errorMessage = error.message;
            notify({
                type: 'warning',
                messageArgs: {
                    _: errorMessage
                },
            });
        });
    };

    const validate = (values: FormData) => {
        const errors = { username: undefined, password: undefined };

        if (!values.username) {
            errors.username = translate('ra.validation.required');
        }
        if (!values.password) {
            errors.password = translate('ra.validation.required');
        } else {
            const {
                contains,
                length
            } = passwordStrength(values.password);
            errors.password = [];
            if(length < 8) {
                errors.password.push(`The password must be at least 8 character long`);
            }
            ['lowercase', 'uppercase', 'symbol', 'number'].forEach(char => {
                if(!contains?.includes(char)) {
                    errors.password.push(`The password must contain a ${char}`);
                }
            })
            if(errors.password.length) {
                errors.password = errors.password.reduce((p, n) => <>{p}<br />{n}</>);
            } else {
                errors.password = undefined;
            }
            
        }
        if (!values.passwordrepeat || values.passwordrepeat !== values.password) {
            errors.passwordrepeat = "Passwords must match";
        }
        return errors;
    };

    return (<Box sx={style}>
                <Form
                    onSubmit={submit}
                    validate={validate}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} noValidate>
                            <div className={classes.form}>
                                <div className={classes.input}>
                                    <Field
                                        autoFocus
                                        id="username"
                                        name="username"
                                        component={Input}
                                        label={translate('ra.auth.username')}
                                        disabled={loading}
                                    />
                                </div>
                                <div className={classes.input}>
                                    <Field
                                        id="password"
                                        name="password"
                                        component={PWInput}
                                        label={translate('ra.auth.password')}
                                        type="password"
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div className={classes.input}>
                                    <Field
                                        id="passwordrepeat"
                                        name="passwordrepeat"
                                        component={Input}
                                        label={'Repeat passowrd'}
                                        type="password"
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    color="primary"
                                    disabled={loading}
                                    className={classes.button}
                                >
                                    {loading && (
                                        <CircularProgress
                                            className={classes.icon}
                                            size={18}
                                            thickness={2}
                                        />
                                    )}
                                    {"Sign up"}
                                </Button>
                            </CardActions>
                        </form>
                    )}
                />
        </Box>);
}

const SingupForm = () => {
    
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = useCallback(() => {
        setIsOpen(true);
    }, [setIsOpen]);
    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    return (
        <div>
            <CardActions>
                <Button
                    variant="text"
                    type="button"
                    color="secondary"
                    onClick={handleOpen}
                >
                    Create a new account
                </Button>
                <Modal
                    open={isOpen}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Signup />
                </Modal>
            </CardActions>
        </div>
    );
}

export default SingupForm;
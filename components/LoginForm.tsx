import React from 'react';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { useLogin } from 'react-admin';

const LoginForm = () => {
    const login = useLogin();

    return (
        <div>
            <CardActions>
                <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    onClick={() => login()}
                >
                    Login
                </Button>
            </CardActions>
        </div>
    );
}

export default LoginForm;
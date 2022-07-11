export default ({
    isAuthenticated,
    logout,
    loginWithRedirect,
    isLoading,
    error,
    user,
    getAccessTokenSilently,
}) => ({
    // called when the user attempts to log in
    login: (url) => {
        return loginWithRedirect();
    },
    // called when the user clicks on the logout button
    logout: () => {
        return isAuthenticated ? Promise.resolve(logout({
            redirect_uri: window.location.origin,
            federated: true // have to be enabled to invalidate refresh token
        })) :  Promise.resolve();
    },
    // called when the API returns an error
    checkError: ({status}) => {
        if (status === 401 || status === 403) {
            return Promise.reject();
        }
        return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        return isAuthenticated ? Promise.resolve() : getAccessTokenSilently();
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => {
        return Promise.resolve()
    },
    getIdentity: () => isAuthenticated ? Promise.resolve(user) : Promise.reject()
});
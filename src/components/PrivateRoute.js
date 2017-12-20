import React from 'react';
import PropTypes from 'prop-types';
import { store } from 'store';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest}
    render={props =>
      store.getState().authorized ? (
        <Component {...props} />
      ) : (
        <Redirect to={{
            pathname: '/',
            state: { from: props.location },
          }}/>
      )}/>
);

PrivateRoute.propTypes = {
  component: PropTypes.any,
  location: PropTypes.object,
};

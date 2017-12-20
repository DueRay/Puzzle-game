import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'store';
import Router from 'components/Router';

let initState = {
    authorized: false,
};

let store = configureStore(initState);

const render = Component => {
    ReactDOM.render(
        <Provider store={store}>
            <Component />
        </Provider>,
        document.getElementById('app')
    );
};

render(Router);

if (module.hot) {
    module.hot.accept('./components/App', () => {
        render(Router);
    });
}

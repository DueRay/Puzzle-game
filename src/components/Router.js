import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import App from './App';
import Main from './Main';

class Router extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Main}/>
          <PrivateRoute path="/app/:id" exact component={App}/>
          <Route path="*" component={Main}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router

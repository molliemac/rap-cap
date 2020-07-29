import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navigation from './Navigation';
import LandingPage from './Landing';
import SignUpPage from './SignUp';
import SignInPage from './SignIn';
import PasswordForgetPage from './PasswordForget';
import Home from './Home';
import AccountPage from './Account';
import AdminPage from './Admin';
import ManageCategories from './Admin/ManageCategories';
import Category from './Category';

import * as ROUTES from '.././constants/routes';
import { withFirebase } from './Firebase';
import { withAuthentication } from './Session';

const App = () => (
  <Router>
    <div>
      <Navigation />
      <Switch>
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
      <Route exact path={ROUTES.HOME} component={Home} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
      <Route exact path={ROUTES.CATEGORY_DETAILS} component={Category} />
      <Route exact path={ROUTES.MANAGE_CATEGORIES} component={ManageCategories} />
      </Switch>
    </div>
  </Router>
);

export default withAuthentication(App);
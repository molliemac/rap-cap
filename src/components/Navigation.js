import React from 'react';
import { Link } from 'react-router-dom';
import {Fragment} from 'react';

import SignOutButton from './SignOut';
import { AuthUserContext } from './Session';
import * as ROUTES from '.././constants/routes';
import * as ROLES from '.././constants/roles';

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <NavigationAuth authUser={authUser} />
      ) : (
        <NavigationNonAuth />
      )
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
    <nav className="navbar navbar-expand-lg navbar-dark justify-content-between fixed-top">
        <div className="navbar-collapse collapse">
    <ul className="navbar-nav mr-auto">
        <li className="nav-item">
            <Link className="nav-link" to={ROUTES.HOME}>Home</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to={ROUTES.ACCOUNT}>Account</Link>
        </li>
        {!!authUser.roles[ROLES.ADMIN] && (
            <Fragment>
          <li className="nav-item">
            <Link className="nav-link" to={ROUTES.ADMIN}>Admin</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/managecategories">Manage Categories</Link>
          </li>
          </Fragment>
        )}     
    </ul>
      <SignOutButton />
    </div>
    </nav>
);

const NavigationNonAuth = () => (
    <nav className="navbar navbar-expand-lg navbar-dark justify-content-between fixed-top">
        <div className="navbar-collapse collapse">
    <ul className="navbar-nav mr-auto">
        <li className="nav-item">
            <Link className="nav-link" to={ROUTES.HOME}>Home</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
    </ul>
    </div>
    </nav>
);

export default Navigation;
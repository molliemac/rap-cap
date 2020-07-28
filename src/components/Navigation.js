import React from 'react';
import { Link } from 'react-router-dom';

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
        <div className="collapse navbar-collapse">
    <ul className="navbar-nav mr-auto">
        <li className="nav-item">
            <Link className="nav-link" to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to={ROUTES.HOME}>Home</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to={ROUTES.ACCOUNT}>Account</Link>
        </li>
        {!!authUser.roles[ROLES.ADMIN] && (
          <li className="nav-item">
            <Link className="nav-link" to={ROUTES.ADMIN}>Admin</Link>
          </li>
        )}     
    </ul>
      <SignOutButton />
    </div>
    </nav>
);

const NavigationNonAuth = () => (
    <ul>
        <li>
            <Link to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li>
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
    </ul>
);

export default Navigation;
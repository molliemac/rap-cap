import React from 'react';
import { withFirebase } from './Firebase';

const SignOutButton = ({ firebase }) => (
	<form className="form-inline">
	  <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={firebase.doSignOut}>
	  	Sign Out 
	  </button>
	</form>
);

export default withFirebase(SignOutButton);
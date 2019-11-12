import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './components/App'; 
import Firebase, { FirebaseContext } from './components/Firebase';

ReactDOM.render (
	<FirebaseContext.Provider value={new Firebase()}>
	<App />
	</FirebaseContext.Provider>,
	document.getElementById('app'),
);


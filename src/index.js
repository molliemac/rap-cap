import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './components/App'; 
import Firebase, { FirebaseContext } from './components/Firebase';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-174668854-1'); // add your tracking id here.
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render (
	<FirebaseContext.Provider value={new Firebase()}>
	<App />
	</FirebaseContext.Provider>,
	document.getElementById('app'),
);


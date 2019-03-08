import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase';

// Initialize Firebase
var config = {
	apiKey: "AIzaSyADAiMJScQBfwmmSTse3JiLPEzZ_1Wprr4",
	authDomain: "rap-captions.firebaseapp.com",
	databaseURL: "https://rap-captions.firebaseio.com",
	projectId: "rap-captions",
	storageBucket: "",
	messagingSenderId: "137109580353"
};

firebase.initializeApp(config);

ReactDOM.render (
	<App />, 
	document.getElementById('app')
);

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();

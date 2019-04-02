import React, {Component} from 'react';
import Category from './Category';
import Categories from './Categories';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase from '../firebase.js';

class Home extends Component{
 render(){
  return(
   <h1>Home Page</h1>
  );
 }
}

export default Home;
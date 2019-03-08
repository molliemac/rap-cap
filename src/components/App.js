import React, {Component} from 'react';
import fire from './fire';

import CategoryNav from './CategoryNav'; 

export default class App extends React.Component{
	constructor() {
		super();
		this.state = {
			category: "",
			lyrics: {},
		};
		this.category= db.ref().child('categories').child('global');
	}
 render(){
  return(
   <div class="container">
    <CategoryNav />
   </div>
  );
 }
}
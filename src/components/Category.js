import React, {Component} from 'react';
import firebase from '../firebase.js';

class Category extends Component {
	constructor(props) {
    super(props);
    this.state = {
      lyrics: [],
    };
  }
  componentDidMount() {
    const lyricsRef = firebase.database().ref('categories');
    categoriesRef.on('value', (snapshot) => {
      let categories = snapshot.val();

      let newState = [];
      for (let category in categories) {
        newState.push({
          category: category
        })
      }
      this.setState({
        categories: newState
      })
      console.log('categories', newState);
    })
  }
}

export default Category;
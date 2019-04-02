import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import firebase from '../firebase.js';

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = { categories: [] }; // <- set up react state
  }
   componentWillMount(){
    /* Create reference to categories in Firebase Database */
    let categoriesRef = firebase.database().ref('categories');
    categoriesRef.on('child_added', snapshot => {
      /* Update React state when category is added at Firebase Database */
      let category = { text: snapshot.val(), id: snapshot.key };
      this.setState({ categories: [category].concat(this.state.categories) });
    })
  }
  addCategory(e){
    e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the category to Firebase */
    firebase.database().ref('categories').push( this.inputEl.value );
    this.inputEl.value = ''; // <- clear the input
  }
  render() {
    return (
      
      <div className="container">
      <h1>Categories</h1>
        <form id="category-form" onSubmit={this.addCategory.bind(this)}>
        <div className="form-group">
          <input className="form-control" type="text" placeholder="Enter a new category" ref={ el => this.inputEl = el }/>
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit"/>
        </div>
        </form>
        <div className="list-group">
        {this.state.categories.map(category => (
          <Link to={`/categories/${category.id}`} key={category.id} className="list-group-item">{category.text}</Link>
        ))}
      </div>
      </div>

      
      
    );
  }
}

export default Categories;
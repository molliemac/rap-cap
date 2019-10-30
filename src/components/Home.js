import React, {Component} from 'react';
// import Categories from './Categories';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase from '../firebase.js';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      category: '',
      categories: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const categoriesRef = firebase.database().ref('categories');
    const category = this.state.category;
    categoriesRef.push(category);
    this.setState({
      category: ''
    })
  }

  componentDidMount() {
    const categoriesRef = firebase.database().ref('categories');
    categoriesRef.on('value', (snapshot) => {
      let categories = snapshot.val();
      console.log(categories);
      let newState = [];
      for (let category in categories) {
        console.log(category);
        newState.push({
          id: categories[category]
        });
      }
      this.setState({
        categories: newState
      });
    });
  }

  render() {
    return (
        <div className="container">
          <h2 className="logo">I'd Rap That</h2>

      <section className='display-item'>
        <div className="wrapper">
          <ul className="categories">
            {this.state.categories.map((category) => {
              return (
                <li key={category.id} className={`${category.id}`.toLowerCase()}>
                  <Link to={`/${category.id}`}>{category.id}</Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
      <form onSubmit={this.handleSubmit}>
          <input type="text" name="category" placeholder="New Category" onChange={this.handleChange} value={this.state.category} />
          <button>Add Category</button>
        </form>
    </div>
    );
  }
}

export default Home;
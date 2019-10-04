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
      <div>
      <div className="container">
        <h2>Home</h2>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="category" placeholder="New Category" onChange={this.handleChange} value={this.state.category} />
          <button>Add Category</button>
        </form>
      </div>

      <section className='display-item'>
        <div className="wrapper">
          <ul>
            {this.state.categories.map((category) => {
              return (
                <li key={category.id}>
                  <Link to={`/${category.id}`}>{category.id}</Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </div>
    );
  }
}

export default Home;
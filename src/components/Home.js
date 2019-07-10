import React, {Component} from 'react';
// import Category from './Category';
// import Categories from './Categories';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase from '../firebase.js';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      lyrics: [],
    };
  }
  componentDidMount() {
    const categoriesRef = firebase.database().ref('categories');
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

  render() {
    return(
      <div>
        <div>
          <div>
          <h3>Categories</h3>

          </div>
          <section id="categories">
            <div>
              {this.state.categories.map((category) => {
                return (
                  <div key={category.category}>
                    <h3>{category.category}</h3>
 
                  </div>

                )
              })}
            </div>
          </section>
        </div>
      </div>


    );
  }
}

export default Home;
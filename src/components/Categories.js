import React, {Component} from 'react';
import { Route, Link } from 'react-router-dom';
import firebase from '../firebase.js';
//import Category from './Category';

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      lyrics: [],
    };
  }
  componentDidMount() {
    let categoriesRef = firebase.database().ref('lyrics').on('value', snapshot => {
      const categoriesObject = snapshot.val();
      console.log('categoriesRef', categoriesRef.category);
      const categoriesList = Object.keys(categoriesObject).map(key => ({
        ...categoriesObject[key],
        uid: key,
      }));

      this.setState({
        categories: categoriesList
      })
      
      
    })
    
  }

  render() {
   const { categories } = this.state;
   console.log('this.state', this.state);
    return(
      <div>
          <h3>Categories</h3>
          <ul>
              {categories.map(category => ( 
                  
                  
                  <li key={category.uid}>
                    <Link to={`/categories/${category.uid}`}>{category.uid}</Link>
                  </li>

              ))}
              </ul>
              <Route path={`/categories/:uid`} component={Category} />
        </div>
    );
  }
  
}

function Category ({ match }) {
  

  return (
    <div>
      <h2>{match.params.uid}</h2>
      
    </div>
  )
}

export default Categories;
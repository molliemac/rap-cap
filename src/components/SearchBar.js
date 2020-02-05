import React, {Component} from 'react';
import { Route, Link } from 'react-router-dom';
import { FirebaseContext } from './Firebase';
//import Category from './Category';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      lyrics: [],
    };
  }
  componentDidMount() {
    let categoriesRef = this.props.firebase.database().ref('lyrics').on('value', snapshot => {
      const categoriesObject = snapshot.val();
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

export default SearchBar;
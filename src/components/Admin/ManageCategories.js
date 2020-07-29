import React, {Component} from 'react';
import { FirebaseContext } from '../Firebase';
import { withFirebase } from '../Firebase';
import {Fragment} from 'react';

class ManageCategories extends Component {
	 constructor(props) {
    super(props);
    this.state = {
      categories: [],
      categoryName: ''
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
    this.props.firebase.categories().push({
      categoryName: this.state.categoryName,
    });

    this.setState({
      categoryName: '',
    });

    e.preventDefault();
  }

  componentDidMount() {
    this.props.firebase
      .categories()
      .on('value', (snapshot) => {
      const categoryObject = snapshot.val();
      console.log('categoryObject', categoryObject);

      const categoryList = Object.keys(categoryObject).map(key=> ({
        ...categoryObject[key],
        uid: key,
      }));
      console.log('categoryList', categoryList);

      this.setState({
        categories: categoryList,
      });
    });
  }

  render() {
  	const { categoryName, categories } = this.state;
  	console.log('this.state.categories ManageCategories', this.state.categories);
  	return (
  		<Fragment>
  		<div className="container">
  		<div className="row">
  		<form onSubmit={this.handleSubmit}>
        <input type="text" name="categoryName" placeholder="New Category" onChange={this.handleChange} value={this.state.categoryName} />
        <button>Add Category</button>
      </form>
      </div>
      <div className="row">
      <ul>
        {this.state.categories.map((category) => {
          return (
            <li key={category.uid}>
              {category.categoryName}
            </li>
          )
        })}
      </ul>
      </div>
      </div>
      </Fragment>
  	);
  }

}

export default withFirebase(ManageCategories);
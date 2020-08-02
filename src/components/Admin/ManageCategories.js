import React, {Component} from 'react';
import { FirebaseContext } from '../Firebase';
import { compose } from 'recompose';
import * as ROLES from '../../constants/roles';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
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
    this.removeCategory = this.removeCategory.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  removeCategory(uid) {
    const categoryRef = this.props.firebase.category(uid);
    categoryRef.remove();
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
      console.log('manage categories', categoryObject);

      const categoryList = Object.keys(categoryObject).map(key=> ({
        ...categoryObject[key],
        uid: key,
      }));
      console.log('ManageCategories', categoryList);

      this.setState({
        categories: categoryList,
      });
    });
  }

  render() {
  	const { categoryName, categories } = this.state;
  	const { match } = this.props;
    console.log('this.props', this.props);
  	return (
  		<Fragment>
  		<div className="container mt-5">
  		<div className="row">
      <h1>Manage Categories</h1>
      </div>
      <div className="row mb-5">
    		<form className="form-inline" onSubmit={this.handleSubmit}>
        <div className="form-group mx-sm-3 mb-2">
          <input type="text" name="categoryName" placeholder="New Category" onChange={this.handleChange} value={this.state.categoryName} />
          </div>
          <button type="submit" class="btn btn-primary mb-2">Add Category</button>
        </form>
      </div>
      
      <div className="row">
      <ul>
        {this.state.categories.map((category) => {
          return (
            <li key={category.uid}>
              {category.categoryName} <span>
           
            <FontAwesomeIcon icon={faTimesCircle} onClick={() => this.removeCategory(category.uid)} />
          </span>
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

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withAuthorization(condition),
  withFirebase,
)(ManageCategories);
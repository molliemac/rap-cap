import React, {Component} from 'react';
// import Categories from './Categories';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { FirebaseContext } from './Firebase';
import { withFirebase } from './Firebase';
import { Select } from 'react-select';
import SearchBar from './SearchBar';
import {Fragment} from 'react';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryName: '',
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
    console.log('this.state.categories', this.state.categories);
    return (
      <Fragment>
      <div className="jumbotron bgimg">
        <div className="container">
        <img src={require("../images/rapcap-logo.png")} alt="Rap Cap" className="logo mx-auto d-block"/>
          <h2 className="logo-text">I'd Rap That</h2>
          <p className="subheader text-center">Looking for your next <span role="img" aria-label="fire emoji">🔥</span> caption? You're in the right spot.</p>
          <SearchBar/>
        </div>
      </div>
        <div className="container">
            <section className='display-item'>
              <div className="wrapper">
                <ul className="categories">
                  {this.state.categories.map((category) => {
                    return (
                      <li key={category.uid} className={`${category.categoryName}`.toLowerCase()}>
                        <Link to={{
                          pathname: `/${category.categoryName}`,
                          state: {
                            categoryId: `${category.uid}`
                          }
                        }}>{category.categoryName}</Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </section>
           
          </div>
          </Fragment>
     );
  }
}

export default withFirebase(LandingPage);
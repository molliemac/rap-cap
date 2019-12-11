import React, {Component} from 'react';
// import Categories from './Categories';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { FirebaseContext } from './Firebase';
import { withFirebase } from './Firebase';

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
    return (
        <div className="container">
          <h2 className="logo">I'd Rap That</h2>

            <section className='display-item'>
              <div className="wrapper">
                <ul className="categories">
                  {this.state.categories.map((category) => {
                    return (
                      <li key={category.uid} className={`${category.categoryName}`.toLowerCase()}>
                        <Link to={`/${category.uid}`}>{category.categoryName}</Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </section>
            <form onSubmit={this.handleSubmit}>
                <input type="text" name="categoryName" placeholder="New Category" onChange={this.handleChange} value={this.state.categoryName} />
                <button>Add Category</button>
              </form>
          </div>
     );
  }
}

export default withFirebase(LandingPage);
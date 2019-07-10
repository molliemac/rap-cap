import React, {Component} from 'react';
// import { Link } from 'react-router-dom';
// import firebase from '../firebase.js';

function SelectCategory(props) {
  var categories = ['All', 'Drizzy Drake', '90s', '00s', 'Summa, Summa Summatime', 'Catching Flights Not Feelings', 'Bo$$ Bitch', 'Fit Fam'];

  return (
    <ul className="categories">
      {categories.map(function(category) {
        return (
          <div><li 
            // style={lang === props.selectedLanguage ? { color: '#d0021b' } : null}
            onClick={props.onSelect.bind(null, category)}
            key={category}>
            {category}
          </li>
          </div>
        )
      })}
    </ul>
  )
}

// function AddLyricsForm(props) {
//   return (
//     <form id="category-form">
//       <div className="form-group">
//         <input className="form-control" type="text" placeholder="Enter a new category" />
//       </div>
//       <div className="form-group">
//         <input className="form-control" type="text" placeholder="Enter a new lyric" />
//       </div>
//       <div className="form-group">
//         <input className="form-control" type="text" placeholder="Enter an artist" />
//       </div>
//       <div className="form-group">
//         <input className="btn btn-primary" type="submit"/>
//       </div>
//     </form>
//   )

// }


// RepoGrid.propTypes = {
//   repos: PropTypes.array.isRequired,
// }

// SelectLanguage.propTypes = {
//   selectedLanguage: PropTypes.string.isRequired,
//   onSelect: PropTypes.func.isRequired,
// }

class Test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCategory: ''
    };

    this.updateCategory = this.updateCategory.bind(this);
  }
  componentDidMount() {
    this.updateCategory(this.state.SelectCategory);
    console.log('category', this);
  }
  updateCategory(category) {
    this.setState(function() {
      
      return {
        selectedCategory: category
      }
    });

  }
  render() {

    return (
      <div>
        <SelectCategory 
          selectedCategory={this.state.selectedCategory}
          onSelect={this.updateCategory}

        />
      
      </div>
    )
  }
}

export default Test;
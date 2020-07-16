import React, {Component} from 'react';
import { Route, Link } from 'react-router-dom';
import Select from 'react-select';
import { FirebaseContext } from './Firebase';
// import styled from '@emotion/styled';


class SearchBar extends Component {
  state = {
    selectedOption: null
  };

 handleChange = selectedOption => {
  this.setState({ selectedOption });
 }

 render() {
  const scaryAnimals = [
      { label: "Alligators", value: 1 },
      { label: "Crocodiles", value: 2 },
      { label: "Sharks", value: 3 },
      { label: "Small crocodiles", value: 4 },
      { label: "Smallest crocodiles", value: 5 },
      { label: "Snakes", value: 6 }
    ];

  const { selectedOption } = this.state;

  return(
    <div>
      <Select
        value={selectedOption}
        options={scaryAnimals}
        onChange={this.handleChange}
        
        placeholder= "Is it worth it? Let me search it..."
        openMenuOnClick={false}

        
      />
    </div>
    );
 }
  
}

export default SearchBar;
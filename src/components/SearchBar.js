import React, {Component} from 'react';
import { Route, Link } from 'react-router-dom';
// import styled from '@emotion/styled';
import AsyncSelect from 'react-select/async';
import { withFirebase } from './Firebase';


class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
     selectedOption: null
    };
  }

  loadOptions = inputValue => {
   if (!inputValue) {
    return Promise.resolve({ options: [] });
   }
      return this.props.firebase.lyrics().once('value')
        .then((snapshot) => {
          const lyricObject = snapshot.val();
          console.log('lyricObject', lyricObject);

          const lyrics = Object.keys(lyricObject).map(key=> ({
            ...lyricObject[key],
            uid: key,
          }));

          const lyricList = lyrics.map((lyric) => {
            return {
            value: lyric.lyricText, 
            label: lyric.lyricText
            }
          });
        
        return lyricList;
        
      }).then(function(lyricList) {
        let options = lyricList.filter(option =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        return options;
      })
  };

 render() {
  return(
    <div>
      
      <AsyncSelect
        defaultOptions
        cacheOptions
        loadOptions={this.loadOptions}
        placeholder= "Is it worth it? Let me search it..."
        openMenuOnClick={false}
      />
    </div>
    );
 }
  
}

export default withFirebase(SearchBar);
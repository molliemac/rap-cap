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
    this.customFilter = this.customFilter.bind(this);
  }

  loadOptions = inputValue => {
      return this.props.firebase.lyrics().once('value')
        .then((snapshot) => {
          const lyricObject = snapshot.val();

          const lyrics = Object.keys(lyricObject).map(key=> ({
            ...lyricObject[key],
            uid: key,
          }));

          const lyricList = lyrics.map((lyric) => {
            return {
            value: lyric, 
            label: lyric.lyricText,
            }
          });
        
        return lyricList;
        
      });
  };

  customFilter(option, searchText) {
    if (
      option.value.lyricText.toLowerCase().includes(searchText.toLowerCase()) ||
      option.value.artist.toLowerCase().includes(searchText.toLowerCase()) ||
      option.value.song.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  }

 render() {
  return(
    <div>
      
      <AsyncSelect
        defaultOptions
        cacheOptions
        loadOptions={this.loadOptions}
        placeholder= "Is it worth it? Let me search it..."
        openMenuOnClick={false}
        filterOption={this.customFilter}
        getOptionLabel={option =>`${option.value.lyricText} | ${option.value.song} | ${option.value.artist}`}
      />
    </div>
    );
 }
  
}

export default withFirebase(SearchBar);
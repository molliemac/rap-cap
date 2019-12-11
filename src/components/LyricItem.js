import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import AsyncSelect from 'react-select/async';
import { withFirebase } from './Firebase';

class LyricItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.lyric.lyricText,
      editSong: this.props.lyric.song,
      editArtist: this.props.lyric.artist,
      editSongLink: this.props.lyric.songLink,
      editCategory: this.props.lyric.category,
    };
    console.log('this.state', this.state);
  }

  loadOptions = () => {
      return this.props.firebase.categories().once('value').then((snapshot) => {
        let categories = Object.keys(snapshot.val()).map((val) => {return {value: val, label: val}})
        console.log(categories);
        return categories;
      });

    };

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.lyric.lyricText,
      editSong: this.props.lyric.song,
      editArtist: this.props.lyric.artist,
      editSongLink: this.props.lyric.songLink,
      editCategory: this.props.lyric.category,
    }));
  };

  onChangeEditText = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  onChangeEditCategory = (selectedOption) => {
    
    console.log(`Option selected:`, selectedOption.value);
    console.log('this.state.editCategory', this.state.editCategory);
  };

  onSaveEditText = () => {
    this.props.onEditLyric(this.props.lyric, this.state.editText, this.state.editSong, this.state.editArtist, this.state.editSongLink, this.state.editCategory);

    this.setState({ editMode: false });
  };
    


  render() {
    const { lyric, onRemoveLyric } = this.props;

    const { editMode, editText, editSong, editArtist, editSongLink, editCategory } = this.state;
    
    
    return (
      <tr>    
      <td>
        {editMode ? (
          <input
            type="text"
            name="editText"
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : ( 
            <span>{lyric.lyricText}</span>
        )}
      </td>
      <td>
        {editMode ? (
          <input
            type="text"
            name="editSong"
            value={editSong}
            onChange={this.onChangeEditText}
          />
        ) : (
            <span><a href={lyric.songLink} target="_blank">{lyric.song}</a></span>
        )}
      </td>
      <td>
        {editMode ? (
          <input
            type="text"
            name="editArtist"
            value={editArtist}
            onChange={this.onChangeEditText}
          />
        ) : (
            <span>{lyric.artist}</span>
        )}
      </td>
      <td>
        {editMode ? (
          <input
            type="text"
            name="editSongLink"
            value={editSongLink}
            onChange={this.onChangeEditText}
          />
        ) : (
            <span>{lyric.songLink}</span>
        )}
      </td>
      <td>
        {editMode ? (
          <AsyncSelect
            cacheOptions
            defaultOptions
            isMulti
            loadOptions={this.loadOptions}
            onChange={this.onChangeEditCategory}
            value={editCategory}
            name="editCategory"
          />
         
        ) : (
          <span>
           
          
          </span>
        )}

      </td>
      <td>
      {editMode ? (
          <span>
            <button onClick={this.onSaveEditText}>Save</button>
            <button onClick={this.onToggleEditMode}>Reset</button>
          </span>
        ) : (
          <span>
            <FontAwesomeIcon icon={faEdit} onClick={this.onToggleEditMode} />
            <FontAwesomeIcon icon={faTimesCircle} onClick={() => onRemoveLyric(lyric.uid)} />
          </span>
        )}
        
      </td>
      </tr>

    );
  }
}

export default withFirebase(LyricItem);
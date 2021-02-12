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
      editId: this.props.lyric.uid,
      selectedCategories: [],
    };
  }

  componentDidMount() {
    this.getSelectedCategories(this.state.editCategory);
  }

  loadOptions = () => {
      return this.props.firebase.categories().once('value').then((snapshot) => {
        const categoryObject = snapshot.val();

        const categoryList = Object.keys(categoryObject).map(key=> ({
          ...categoryObject[key],
          uid: key,
        }));

        const options = categoryList.map((category) => {
          return {value: category.uid, label: category.categoryName};
        });
        
        return options;
      });

    };

    getSelectedCategories = (editCategory) => {
      //create a function to set default values in async, i.e. the categories saved to the db
      
      const categoryList = Object.keys(editCategory).map(key=> ({
          ...editCategory[key],
          uid: key,
        }));
      
  
      const result = categoryList.map(a => a.uid);
      
       var reads = {};

       const promises = categoryList.map(
        categoryId => this.props.firebase
          .category(categoryId.uid)
          .once('value')
          .then(snapshot => ({
            "value": categoryId.uid,
            "label": snapshot.val().categoryName
          })));

       Promise.all(promises).then(values => {
        this.setState({selectedCategories: values})
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
      selectedCategories: this.state.selectedCategories,
    }));
  };

  onChangeEditText = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  onChangeEditCategory = (e) => {
    this.setState({selectedCategories:e});
  };

  onSaveEditText = (lyric, editLyric, editText, editSong, editArtist, editSongLink, editCategory, editId) => {
    const categoryList = this.state.selectedCategories.map((category) => {
      return category.value;
    });

     const categoryObj = categoryList.reduce((a, key) => Object.assign(a, { [key]: true}), {});

    const lyricKey = this.state.editId;
    var updatedLyricData = {};

    updatedLyricData['/lyrics/' + lyricKey + '/category'] = categoryObj;
    
    categoryList.forEach(function(categoryId) {
      updatedLyricData['/categories/' + categoryId + '/lyrics/' + lyricKey] = true;
    });

    this.props.firebase.db.ref().update(updatedLyricData);

    this.setState({
      editMode: false,
      editText: this.props.lyric.lyricText,
      editSong: this.props.lyric.song,
      editArtist: this.props.lyric.artist,
      editSongLink: this.props.lyric.songLink,
      editCategory: this.props.lyric.category,
      editId: this.props.lyric.uid,
    });
  };
    

  render() {
    const { lyric, onRemoveLyric } = this.props;

    const { editMode, editText, editSong, editArtist, editSongLink, editCategory, selectedCategories } = this.state;

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
            defaultOptions
            isMulti
            loadOptions={this.loadOptions}
            onChange={this.onChangeEditCategory}
            value={selectedCategories}
            name="selectedCategories"
          />
         
        ) : (
          <span>
           {
           this.state.selectedCategories === null ? "" : this.state.selectedCategories.map((s, index) => <span key={index}>{(index ? ', ' : '') + s.label}</span>)
        }
          
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
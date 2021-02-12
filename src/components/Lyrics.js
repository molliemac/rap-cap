import React, { Component } from 'react';

import { AuthUserContext } from './Session';
import { withFirebase } from './Firebase';
import LyricList from './LyricList';
import AsyncSelect from 'react-select/async';

class Lyrics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: [],
      lyricText:'',
      artist: '',
      song: '',
      songLink: '',
      loading: false,
      lyrics: [],
      limit: 25,
      search: '',
    };
  }

  componentDidMount() {
    this.onListenForLyrics();
  }

  onListenForLyrics = () => {
    this.setState({ loading: true });

    this.props.firebase
      .lyrics()
      .limitToLast(this.state.limit)
      .on('value', snapshot => {
        const lyricObject = snapshot.val();
        
        if (lyricObject) {
          const lyricList = Object.keys(lyricObject).map(key => ({
            ...lyricObject[key],
            uid: key,
          }));
                 
          this.setState({
            lyrics: lyricList,
            loading: false,
          });
        } else {
          this.setState({ lyrics: null, loading: false });
        }
        
      });

  };

  componentWillUnmount() {
    this.props.firebase.lyrics().off();
  };

  onChangeLyric = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  onChangeCategory = (category) => {
    this.setState({category});
console.log('categoryList', this.state.category);
  };

  loadOptions = () => {
      return this.props.firebase.categories().once('value').then((snapshot) => {
        const categoryObject = snapshot.val();
        console.log('categoryObject', categoryObject);
        const categoryList = Object.keys(categoryObject).map(key=> ({
          ...categoryObject[key],
          uid: key,
        }));
        console.log('categoryList', categoryList);

        const options = categoryList.map((category) => {
          return {value: category.uid, label: category.categoryName};
        });

        return options;
      });

    };

  onCreateLyric = (event) => {
    const categoryList = this.state.category.map((category) => {
      return category.value;
    });

    console.log('category', this.state.category);

    const newLyricRef = this.props.firebase.lyrics().push({
      lyricText: this.state.lyricText,
      artist: this.state.artist,
      song: this.state.song,
      songLink: this.state.songLink,
    });

    const newLyricKey = newLyricRef.key;
    const categoryObj = categoryList.reduce((a, key) => Object.assign(a, { [key]: true}), {});
        console.log('categoryObj', categoryObj);
    // Create the data we want to update
    var updatedLyricData = {};
    updatedLyricData['/lyrics/' + newLyricKey + '/category'] = categoryObj;
    
    categoryList.forEach(function(categoryId) {
      updatedLyricData['/categories/' + categoryId + '/lyrics/' + newLyricKey] = true;
    });

    this.props.firebase.db.ref().update(updatedLyricData);

    this.setState({ 
      lyricText: '',
      artist: '',
      song: '',
      songLink: '',
      category: '',
    });

    event.preventDefault();
  };

  onEditLyric = (lyric, lyricText, song, artist, songLink, category) => {
    const { uid, ...lyricSnapshot } = lyric;

    this.props.firebase.lyric(lyric.uid).set({
      ...lyricSnapshot,
      lyricText,
      song,
      artist,
      songLink,
      category,
    });
  };

  onRemoveLyric = uid => {
    this.props.firebase.lyric(uid).remove();
  };

  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 25 }),
      this.onListenForLyrics,
    );
  };

  updateSearch(event) {
    this.setState({search: event.target.value.substr(0, 20)});
  };

  render() {
    const { lyricText, song, artist, songLink, lyrics, category, loading } = this.state;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
          <form
            onSubmit={event =>
              this.onCreateLyric(event)
            }
          >
          <div className="form-row">
            <div className="form-group col-md-6">
              <input
                type="text"
                name="lyricText"
                placeholder="Lyric"
                value={lyricText}
                onChange={this.onChangeLyric}
              />
            </div>
            <div className="form-group col-md-6">
              <input
                type="text"
                name="song"
                placeholder="Song"
                value={song}
                onChange={this.onChangeLyric}
              />
            </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-4">
                <input
                type="text"
                name="artist"
                placeholder="Artist"
                value={artist}
                onChange={this.onChangeLyric}
              />
              </div>
              <div className="form-group col-md-4">
                <input
                type="text"
                name="songLink"
                placeholder="Genius Lyric"
                value={songLink}
                onChange={this.onChangeLyric}
              />
              </div>
              <div className="form-group col-md-4">
                <AsyncSelect
                defaultOptions
                isMulti
                loadOptions={this.loadOptions}
                onChange={this.onChangeCategory}
                value={category}
                name="category"
              />
              </div>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
        </div>
        <div className="row">
        <div className="col-xl-12">
          <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-default">search lyrics</span>
              </div>
              <input type="text" className="form-control" id="lyricSearch" value={this.state.search} onChange={this.updateSearch.bind(this)} aria-label="Default" aria-describedby="inputGroup-sizing-default" />
            </div>
            </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            {!loading && lyrics && (
              <button type="button" onClick={this.onNextPage}>
                More
              </button>
            )}

            {loading && <div>Loading ...</div>}

            {lyrics && (
              <LyricList
                lyrics={lyrics.map(lyric => ({
                  ...lyric,
                }))}
                onEditLyric={this.onEditLyric}
                onRemoveLyric={this.onRemoveLyric}
              />
            )}

            {!lyrics && <div>There are no lyrics ...</div>}
          </div>
        </div>
      </div>
    );
  }
}

export default withFirebase(Lyrics);
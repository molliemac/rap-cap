import React, {Component} from 'react';
import firebase from '../firebase.js';

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: this.props.match.params.id,
      lyric: '',
      artist: '',
      song: '',
      lyrics: [],
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
    e.preventDefault();
    const lyricsRef = firebase.database().ref('lyrics');
    const lyric = {
      lyric: this.state.lyric,
      artist: this.state.artist,
      song: this.state.song,
      category: this.state.category
    }
    lyricsRef.push({
      lyric: this.state.lyric,
      artist: this.state.artist,
      song: this.state.song,
      category: this.state.category,
    });
    this.setState({
      lyric: '',
      artist: '',
      song: ''
    });
  }

  componentDidMount() {
    const lyricsRef = firebase.database().ref('lyrics');
    lyricsRef.orderByChild("category").equalTo(this.state.category).on('value', (snapshot) => {
      let lyrics = snapshot.val();
      let newState = [];

      for (let lyric in lyrics) {
        newState.push({
          id: lyric,
          lyric: lyrics[lyric].lyric,
          artist: lyrics[lyric].artist,
          song: lyrics[lyric].song,
          category: lyrics[lyric].category
        });
      }
      this.setState({
        lyrics: newState
      });
    });
  }

  render() {
    const {lyrics} = this.state;
    return(
      <div>
        <div className="form">
          <h1>Category: {this.state.category } </h1>
            <form onSubmit={this.handleSubmit}>
              <input type="text" name="lyric" placeholder="New Lyric" onChange={this.handleChange} value={this.state.lyric} />
              <input type="text" name="artist" placeholder="Artist" onChange={this.handleChange} value={this.state.artist} />
              <input type="text" name="song" placeholder="Song" onChange={this.handleChange} value={this.state.song} />
              <button>Add Lyric</button>
            </form>
        </div>
        <div className="lyricsList">
          <ul>
            {this.state.lyrics.map((lyric) => {
              return (
                <li key={lyric.id}>
                  <h3>{lyric.lyric}</h3>
                  <p>Artist: {lyric.artist}</p>
                  <p>Song: {lyric.song}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    );
  }
}



export default Category;
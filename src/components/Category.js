import React, {Component} from 'react';
import firebase from '../firebase.js';

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: this.props.match.params.id,
      lyrics: []
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit(e) {
    e.preventDefault();
    const lyricsRef = firebase.database().ref('lyrics');
    const { lyrics } = this.state;
    console.log('this.state', this.state);
    const lyric = {
      lyric: this.refs.lyric.value,
      artist: this.refs.artist.value,
      song: this.refs.song.value,
      category: this.state.category
    }

    lyricsRef.push(lyric);
    this.setState({ lyrics });
    console.log('lyric', lyric);

    this.refs.lyric.value = "";
    this.refs.artist.value = "";
    this.refs.song.value = "";
  };

  componentDidMount() {
    let lyricsRef = firebase.database().ref('lyrics');
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
      console.log(this.state.lyrics);
    });
  }

  updateData = lyric => {
    this.refs.lyric.value = lyric.lyric;
    this.refs.artist.value = lyric.artist;
    this.refs.song.value = lyric.song;
    this.refs.uid.value = lyric.id;
  }

  render() {
    const {lyrics} = this.state;
    return(
      <div>
        <div className="form">
          <h1>Category: {this.state.category } </h1>
            <form onSubmit={this.handleSubmit}>
              <input type="hidden" ref="uid" />
              <input type="text" ref="lyric" placeholder="New Lyric" />
              <input type="text" ref="artist" placeholder="Artist" />
              <input type="text" ref="song" placeholder="Song" />
              <button>Add Lyric</button>
            </form>
        </div>
        <div className="lyricsList">
          <ul>
            {lyrics.map((lyric) => {
              return (
                <li key={lyric.id}>
                  <h3>{lyric.lyric}</h3>
                  <p>Artist: {lyric.artist}</p>
                  <p>Song: {lyric.song}</p>
                  
                  <button
                      onClick={() => this.updateData(lyric)}
                      className="btn btn-link"
                    >
                      Edit
                    </button>
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
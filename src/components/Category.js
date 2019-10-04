import React, {Component} from 'react';
import firebase from '../firebase.js';

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: this.props.match.params.id,
      lyric: '',
      artist: '',
      lyrics: {},
    }
    this.catLyrics = db.ref().child('lyrics');
    this.handleNewLyrics = snap => {
      console.log(snap.val());
      if (snap.val()) this.setState({ lyrics: snap.val() });
    };
  }

  componentDidMount() {
    this.catLyrics.on('value', this.handleNewLyrics);
  }

  componentWillUnmount() {
    this.chatRoom.off('value', this.handleNewLyrics);
  }
  handleLyricChange = e => this.setState({ lyric: e.target.value });
  handleArtistChange = e => this.setState({ artist: e.artist.value });
  handleClick = e => {
    // register the lyric
    db.ref().child('lyrics').push({
      lyric: this.state.lyric,
      artist: this.state.artist,
    });
  };

  

  componentDidMount() {
    const lyricsRef = firebase.database().ref('lyrics');
    lyricsRef.on('value', (snapshot) => {
      let lyrics = snapshot.val();
      console.log(lyrics);
      let newState = [];
      for (let lyric in lyrics) {
        console.log(lyric);
        newState.push({
          id: lyrics
        });
      }
      this.setState({
        categories: newState
      });
    });
  }

  render() {
    return(
      <div>
      <h1>Category: {this.state.category } </h1>

      <form onSubmit={this.handleSubmit}>
        <input type="text" name="lyric" placeholder="New Lyric" onChange={this.handleChange} value={this.state.lyric} />
        <input type="text" name="artist" placeholder="Artist" onChange={this.handleChange} value={this.state.artist} />
        <button>Add Lyric</button>
      </form>


      </div>

    );
  }
}



export default Category;
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

  updateData = lyric => {
    this.refs.uid.value = lyric.uid;
    this.refs.lyric.value = lyric.lyric;
    this.refs.artist.value = lyric.artist;
    this.refs.song.value = lyric.song;
  }

  handleSubmit = event => {
    event.preventDefault();
    let lyric = this.refs.lyric.value;
    let artist = this.refs.artist.value;
    let song = this.refs.song.value;
    let uid = this.refs.uid.value;
    let category = this.state.category;

    if (uid && lyric && artist && song) {
      const { lyrics } = this.state;
      const lyricIndex = lyrics.findIndex(data => {
        console.log('data', data);
        return data.uid === uid;
      });
      lyrics[lyricIndex].lyric = lyric;
      lyrics[lyricIndex].artist = artist;
      lyrics[lyricIndex].song = song;
      lyrics[lyricIndex].category = category;
      this.setState({ lyrics });
    } else if (lyric && song && artist) {
      const uid = new Date().getTime().toString();
      const { lyrics } = this.state;
      lyrics.push({ uid, lyric, song, artist, category });
      this.setState({ lyrics });
    }

    this.refs.lyric.value = "";
    this.refs.artist.value = "";
    this.refs.song.value = "";
    this.refs.uid.value = "";
  };

  // handleSubmit(e) {
  //   e.preventDefault();
  //   const lyricsRef = firebase.database().ref('lyrics');

    
  //     let lyric= this.refs.lyric.value;
  //     let artist= this.refs.artist.value;
  //     let song= this.refs.song.value;
  //     let category= this.state.category;
    

  //   lyricsRef.push({lyric, artist, song, category});
  //   this.setState({
  //     lyric: '',
  //     artist: '',
  //     song: ''
  //   });
  // };

  componentDidMount() {
    let lyricsRef = firebase.database().ref('lyrics');
    lyricsRef.orderByChild('category').equalTo(this.state.category).on('value', (snapshot) => {
      let lyrics = snapshot.val();

      let newState = [];
      for(let lyric in lyrics) {
        newState.push({
          uid: lyric,
          lyric: lyrics[lyric].lyric,
          artist: lyrics[lyric].artist,
          song: lyrics[lyric].song,
          category: lyrics[lyric].category
        });
      }
      this.setState({
        lyrics: newState
      });
      console.log('lyrics', this.state.lyrics);
    });
  }


  // componentDidMount() {
  //   let lyricsRef = firebase.database().ref('lyrics');
  //   lyricsRef.orderByChild("category").equalTo(this.state.category).on('value', (snapshot) => {
  //     let lyrics = snapshot.val();
  //     let newState = [];

  //     for (let lyric in lyrics) {
  //       newState.push({
  //         id: lyric,
  //         lyric: lyrics[lyric].lyric,
  //         artist: lyrics[lyric].artist,
  //         song: lyrics[lyric].song,
  //         category: lyrics[lyric].category
  //       });
  //     }
  //     this.setState({
  //       lyrics: newState
  //     });
  //   });
  // }

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
                <li key={lyric.uid}>
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
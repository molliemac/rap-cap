import React, {Component} from 'react';
import firebase from '../firebase.js';

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: this.props.match.params.id,
      lyrics: [],
    }
    
  }

  updateData = lyric => {
    this.refs.uid.value = lyric.uid;
    this.refs.lyric.value = lyric.lyric;
    this.refs.artist.value = lyric.artist;
    this.refs.song.value = lyric.song;
  }

  handleSubmit = event => {
    event.preventDefault();
    let lyricsRef = firebase.database().ref('lyrics');
    let lyric = this.refs.lyric.value;
    let artist = this.refs.artist.value;
    let song = this.refs.song.value;
    let uid = this.refs.uid.value;
    let category = this.state.category;

    if (uid && lyric && artist && song && category) {
      const { lyrics } = this.state;
      const lyricIndex = lyrics.findIndex(data => {
        console.log('data', data.uid, uid);
        return data.uid === uid;
      });
      lyrics[lyricIndex].lyric = lyric;
      lyrics[lyricIndex].artist = artist;
      lyrics[lyricIndex].song = song;
      lyrics[lyricIndex].category = category;

      lyricsRef.update({
        [uid]: {lyric, artist, song, category}
      })
      
      console.log('edited lyric', this.state, lyrics[lyricIndex]);
    } else if (lyric && song && artist && category) {
      // const uid = new Date().getTime().toString();
      const { lyrics } = this.state;
      lyrics.push({ uid, lyric, song, artist, category });
      lyricsRef.push({ uid, lyric, song, artist, category });
      this.setState({ lyrics });
      console.log('added new', {lyrics});
    }

    this.refs.lyric.value = "";
    this.refs.artist.value = "";
    this.refs.song.value = "";
    this.refs.uid.value = "";
  };

  componentDidMount() {
    let lyricsRef = firebase.database().ref('lyrics');
    lyricsRef.orderByChild('category').equalTo(this.state.category).on('value', (snapshot) => {
      let lyrics = snapshot.val();

      let newState = [];
      for(let lyric in lyrics) {
        console.log('lyric', lyric);
        newState.push({
          uid: lyric,
          lyric: lyrics[lyric].lyric,
          artist: lyrics[lyric].artist,
          song: lyrics[lyric].song,
          category: lyrics[lyric].category
        });
        console.log('newstate', newState);
      }
      this.setState({
        lyrics: newState
      });
    });
  }

  removeLyric(lyricId) {
    const lyricRef = firebase.database().ref(`/lyrics/${lyricId}`);
    lyricRef.remove();
  }

  render() {
    const {lyrics} = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <h1>Category: {this.state.category } </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <h2>Add new lyric here</h2>
            <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input type="hidden" ref="uid" />
              <div className="form-group col-md-4">
                <input type="text" ref="lyric" placeholder="New Lyric" />
              </div>
              <div className="form-group col-md-4">
                <input type="text" ref="artist" placeholder="Artist" />
              </div>
              <div className="form-group col-md-4">
                <input type="text" ref="song" placeholder="Song" />
              </div>
            </div>
              <button type="submit" className="btn btn-primary">Add Lyric</button>
            </form>
          </div>
        </div>
        
 
          <div className="row">
            <div className="col-xl-12">
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
                        >Edit
                      </button>
                        <button
                          onClick={() => this.removeLyric(lyric.uid)}
                          className="btn btn-link"
                        >Remove
                        </button>
                    </li>
                    )
                  })}
              </ul>
            </div>
          </div>
        </div>
    );
  }
}



export default Category;
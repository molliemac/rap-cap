import React, {Component} from 'react';
import { withFirebase } from './Firebase';

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: this.props.match.params.id,
      lyrics: [],
      search: '',
    }
    console.log('this.props.match.params',this.props );
  }

  updateData = lyric => {
    this.refs.uid.value = lyric.uid;
    this.refs.lyric.value = lyric.lyric;
    this.refs.artist.value = lyric.artist;
    this.refs.song.value = lyric.song;
    this.refs.songLink.value = lyric.songLink;
  }

  updateSearch(event) {
    this.setState({search: event.target.value.substr(0, 20)});
  }

  handleSubmit = event => {
    event.preventDefault();
    let lyricsRef = this.props.firebase.lyrics();
    let lyric = this.refs.lyric.value;
    let artist = this.refs.artist.value;
    let song = this.refs.song.value;
    let songLink = this.refs.songLink.value;
    let uid = this.refs.uid.value;
    let category = this.state.category;

    if (uid && lyric && artist && song && songLink && category) {
      const { lyrics } = this.state;
      const lyricIndex = lyrics.findIndex(data => {
        console.log('data', data.uid, uid);
        return data.uid === uid;
      });
      lyrics[lyricIndex].lyric = lyric;
      lyrics[lyricIndex].artist = artist;
      lyrics[lyricIndex].song = song;
      lyrics[lyricIndex].songLink = songLink;
      lyrics[lyricIndex].category = category;

      lyricsRef.update({
        [uid]: {lyric, artist, song, category, songLink}
      })
      
    } else if (lyric && song && artist && category) {
      const { lyrics } = this.state;
      lyrics.push({ uid, lyric, song, artist, category, songLink });
      lyricsRef.push({ uid, lyric, song, artist, category, songLink });
      this.setState({ lyrics });
    }

    this.refs.lyric.value = "";
    this.refs.artist.value = "";
    this.refs.song.value = "";
    this.refs.songLink.value = "";
    this.refs.uid.value = "";
  };

  componentDidMount() {
    this.props.firebase.lyrics().on('value', snapshot => {
      const lyricsObject = snapshot.val();

      const lyricsList = Object.keys(lyricsObject).map(key => ({
        ...lyricsObject[key],
        uid: key,
      }));

      this.setState({
        lyrics: lyricsList,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.lyrics().off();
  }

  removeLyric(uid) {
    const lyricRef = this.props.firebase.lyric(uid);
    lyricRef.remove();
  }

  render() {
    const {lyrics} = this.state;
    let filteredLyrics = lyrics.filter(
      (lyric) => {
        return lyric.lyricText.toLowerCase().indexOf(
          this.state.search) !== -1;
      }
    );

    return (
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <h1>Category: { this.state.category } </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <h2>Add new lyric here</h2>
            <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input type="hidden" ref="uid" />
              <div className="form-group col-md-6">
                <textarea ref="lyric" placeholder="New Lyric" />
              </div>
              <div className="form-group col-md-6">
                <input type="text" ref="artist" placeholder="Artist" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <input type="text" ref="song" placeholder="Song" />
              </div>
              <div className="form-group col-md-6">
                <input type="text" ref="songLink" placeholder="Genius Lyric" />
              </div>
            </div>
              <button type="submit" className="btn btn-primary">Add Lyric</button>
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
              
              <table id="lyricsTable" className="table">
              <thead className="thead-dark">
              <tr>
                <th scope="col">Lyric</th>
                <th scope="col">Song</th>
                <th scope="col">Artist</th>
                <th scope="col">Actions</th>
                </tr>
              </thead>
              
                <tbody>
                {filteredLyrics.map((lyric) => {
                  return (
                    <tr key={lyric.uid}>
                      <td>{lyric.lyricText}</td>
                      <td><a href={lyric.songLink} target="_blank">{lyric.song}</a></td>
                      <td>{lyric.artist}</td>
                        <td><button
                          onClick={() => this.updateData(lyric)}
                          className="btn btn-link"
                        >Edit
                      </button>
                        <button
                          onClick={() => this.removeLyric(lyric.uid)}
                          className="btn btn-link"
                        >Remove
                        </button>
                        </td>
                    </tr>
                    )
                  })}
                 </tbody>
              </table>
            </div>
          </div>
        </div>
    );
  }
}


export default withFirebase(Category);
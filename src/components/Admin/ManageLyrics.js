import React, {Component} from 'react';
import { withFirebase } from '../Firebase';
import AsyncSelect from 'react-select/async';

class ManageLyrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lyrics: [],
      search: '',
      category: [],
      artist: '',
      lyricText:'',
      song: '',
      songLink: '',
    }
    this.loadOptions = this.loadOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  loadOptions = () => {
      return this.props.firebase.categories().once('value').then((snapshot) => {
        const categoryObject = snapshot.val();
      

        const categoryList = Object.keys(categoryObject).map(key=> ({
          ...categoryObject[key],
          uid: key,
        }));

        let key = "categoryName";

        const options = Object.keys(categoryList).map((val) => {return {value: val, label: val}});
        
        return options;
      });

    };

  handleChange = value => {
    this.setState({ value });
  }

  updateData(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;


    this.setState({
      [name]: value
    });
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

    if (uid && lyric && artist && song && songLink) {
      const { lyrics } = this.state;
      const lyricIndex = lyrics.findIndex(data => {
        return data.uid === uid;
      });
      lyrics[lyricIndex].lyric = lyric;
      lyrics[lyricIndex].artist = artist;
      lyrics[lyricIndex].song = song;
      lyrics[lyricIndex].songLink = songLink;

      lyricsRef.update({
        [uid]: {lyric, artist, song, songLink}
      })
      
    } else if (lyric && song && artist) {
      const { lyrics } = this.state;
      lyrics.push({ uid, lyric, song, artist, songLink });
      lyricsRef.push({ uid, lyric, song, artist, songLink });
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
    this.props.firebase.categories().off();
  }

  removeLyric(uid) {
    const lyricRef = this.props.firebase.lyric(uid);
    lyricRef.remove();
  }

  render() {
    const { users } = this.props;
    const { lyricText, song, artist, link, lyrics, loading, category } = this.state;
    
    let filteredLyrics = lyrics.filter(
      (lyric) => {
        return lyric.lyric.toLowerCase().indexOf(
          this.state.search) !== -1;
      }
    );

    return (

      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <h1>Manage Lyrics </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <h2>Add new lyric here</h2>
            <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input type="hidden" />
              <div className="form-group col-md-6">
                <textarea 
                  name="lyric" 
                  placeholder="New Lyric"
                  value={this.lyricText}
                  onChange={this.onChangeText} />
              </div>
              <div className="form-group col-md-6">
                <input 
                  type="text" 
                  name="artist" 
                  placeholder="Artist"
                  value={artist}
                  onChange={this.onChangeText} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-4">
                <input 
                  type="text" 
                  name="song" 
                  placeholder="Song"
                  value={this.song}
                  onChange={this.onChangeText} />
              </div>
              <div className="form-group col-md-4">
                <input 
                  type="text" 
                  name="songLink" 
                  placeholder="Genius Lyric"
                  value={this.link}
                  onChange={this.onChangeText} />
              </div>
              <div className="form-group col-md-4">
                <AsyncSelect
                  cacheOptions
                  defaultOptions=true
                  isMulti
                  loadOptions={this.loadOptions}
                  onChange={this.onChangeText}
                  value={this.category}
                />
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
                <th scope="col">Category</th>
                <th scope="col">Actions</th>
                </tr>
              </thead>
              
                <tbody>
                {filteredLyrics.map((lyric) => {
                  return (
                    <tr key={lyric.uid}>
                      <td>{lyric.lyric}</td>
                      <td><a href={lyric.songLink} target="_blank">{lyric.song}</a></td>
                      <td>{lyric.artist}</td>
                      <td>{lyric.category}</td>
                        <td><button
                          onClick={this.updateData}
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


export default withFirebase(ManageLyrics);
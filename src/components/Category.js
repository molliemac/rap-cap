import React, {Component} from 'react';
import { withFirebase } from './Firebase';

class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: this.props.match.params.id,
      lyrics: [],
      limit: 25,
      search: '',
      loading: false,
      lyricText:'',
      artist: '',
      song: '',
      songLink: '',
    }
  }

  updateSearch(event) {
    this.setState({search: event.target.value.substr(0, 20)});
  }

  componentDidMount() {
    const categoryId = this.props.location.state.categoryId;
    const lyricArr = [];

    this.props.firebase.category(categoryId).child('lyrics').on('value', snapshot => {
      snapshot.forEach((child) => {
        this.props.firebase.lyric(child.key).on('value', childSnapshot => {
          let lyricObject = childSnapshot.val();
          console.log('lyricObject', lyricObject);
          let key = childSnapshot.key;
          // needed to create a UID for the object for render method
          lyricArr.push({
            uid: key,
            song: lyricObject.song,
            songLink: lyricObject.songLink,
            artist: lyricObject.artist,
            lyricText: lyricObject.lyricText,
          });
          //placed this in the wrong place!!
          this.setState({
            lyrics: lyricArr,
            loading: false,
          });
        }); 
      });
      
    });

  };

  componentWillUnmount() {
    this.props.firebase.category().off();
    this.props.firebase.lyric().off();
  }

  render() {
    const { lyrics } = this.state; 
    
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
                </tr>
              </thead>
              
                <tbody>
                {filteredLyrics.map((lyric) => {
                  return (
                    <tr key={lyric.uid}>
                      <td>{lyric.lyricText}</td>
                      <td><a href={lyric.songLink} target="_blank">{lyric.song}</a></td>
                      <td>{lyric.artist}</td> 
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
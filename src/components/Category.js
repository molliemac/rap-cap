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

   componentDidMount() {
    this.onListenForLyrics();
  };

  updateSearch(event) {
    this.setState({search: event.target.value.substr(0, 20)});
  }

  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 25 }),
      this.onListenForLyrics,
    );
  };

  onListenForLyrics = () => {
    const categoryId = this.props.location.state.categoryId;
    const lyricArr = [];

    this.setState({ loading: true });

    this.props.firebase
    .category(categoryId)
    .child('lyrics')
    .limitToLast(this.state.limit)
    .on('value', snapshot => {
      snapshot.forEach((child) => {
        this.props.firebase.lyric(child.key).on('value', childSnapshot => {
          const lyricObject = childSnapshot.val();
           
          const key = childSnapshot.key;

          if (lyricObject) {
            lyricArr.push({
              uid: key,
              song: lyricObject.song,
              songLink: lyricObject.songLink,
              artist: lyricObject.artist,
              lyricText: lyricObject.lyricText,
            });


            this.setState({
              lyrics: lyricArr,
              loading: false,
            });
          } 

        }); 
      });
      
    });

  };


  componentWillUnmount() {
    this.props.firebase.category().off();
    this.props.firebase.lyrics().off();
  }

  render() {
    const { lyrics, loading } = this.state; 
    
    let filteredLyrics = lyrics.filter(
      (lyric) => {
        return lyric.lyricText.toLowerCase().indexOf(
          this.state.search) !== -1;
      }
    );

    return (
      <div>
      <div className="jumbotron jumbotron-fluid d-flex align-items-center" id={this.state.category.toLowerCase().replace(/[^A-Z0-9]+/ig, "-")}>
        <div className="container">
          <h1>{ this.state.category } </h1>
          <div className="input-group mt-5">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-default">search lyrics</span>
            </div>
            <input type="text" className="form-control" id="lyricSearch" value={this.state.search} onChange={this.updateSearch.bind(this)} aria-label="Default" aria-describedby="inputGroup-sizing-default" />
          </div>
          
        </div>
      </div>
      <div className="container">        
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
            <div className="row">
              <div className="col-xl-12"> 
              {!loading && lyrics && (
              <button type="button" className="btn btn-primary float-right" onClick={this.onNextPage}>
                Show More ❯
              </button>
            )}
              </div>
            </div>
          </div>
        </div>
        </div>
    );
  }
}

export default withFirebase(Category);
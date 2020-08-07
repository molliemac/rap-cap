import React, {Component} from 'react';
import { withFirebase } from './Firebase';

class randomLyric extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lyrics: [],
      limit: 1,
      loading: false,
      lyricText:'',
      randomLyric: '',
    }
  }

  componentDidMount() {
    this.onListenForLyrics();
  }

  onListenForLyrics = () => {
    this.setState({ loading: true });

    this.props.firebase
      .lyrics()
      .on('value', snapshot => {
        const lyricObject = snapshot.val();
        console.log('lyricObject', lyricObject);
        if (lyricObject) {
          const lyricList = Object.keys(lyricObject).map(key => ({
            ...lyricObject[key],
            uid: key,
          }));


          console.log('lyricList', lyricList);
                 
          this.setState({
            lyrics: lyricList,
            loading: false,
          });
        } else {
          this.setState({ lyrics: null, loading: false });
        }
        
      });
  };

  selectLyric = () => {
  	console.log('this.state.lyrics', this.state.lyrics);
  	const selectedLyric = this.state.lyrics[Math.floor(Math.random()*this.state.lyrics.length)];
  	this.setState({
  		randomLyric: selectedLyric,
  	});

  	console.log('randomLyric', this.state.randomLyric);

  }

  componentWillUnmount() {
    this.props.firebase.lyrics().off();
  };

  render() {
  	return (
  		<button type="button" className="btn btn-primary" onClick={this.selectLyric}>Gimme a Lyric</button>

  	);
  }
}


  export default withFirebase(randomLyric);
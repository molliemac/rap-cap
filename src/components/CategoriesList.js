import React, { Component } from 'react';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import LyricList from './LyricList';

class CategoriesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: [],
      lyricText:'',
      artist: '',
      song: '',
      link: '',
      loading: false,
      lyrics: [],
      limit: 25,
      search: '',
    };
  }

  componentDidMount() {
    this.onListenForLyrics();
  }

  onListenForLyrics = () => {
    this.setState({ loading: true });

    this.props.firebase
      .lyrics()
      .limitToLast(this.state.limit)
      .on('value', snapshot => {
        const lyricObject = snapshot.val();

        if (lyricObject) {
          const lyricList = Object.keys(lyricObject).map(key => ({
            ...lyricObject[key],
            uid: key,
          })).filter(lyric => lyric.category === this.state.category);

          this.setState({
            lyrics: lyricList,
            loading: false,
          });
        } else {
          this.setState({ lyrics: null, loading: false });
        }
      });
  };

  componentWillUnmount() {
    this.props.firebase.lyrics().off();
  }

  onChangeLyric = event => {
    this.setState({ 
      text : event.target.value,
      artist : event.target.value,
      song : event.target.value,
      link : event.target.value,
      category: event.target.value,
    });
  };

  onCreateLyric = (event, authUser) => {
    this.props.firebase.lyrics().push({
      lyricText: this.state.text,
      artist: this.state.artist,
      song: this.state.song,
      link: this.state.link,
      category: this.state.category,
      userId: authUser.uid,
    });

    this.setState({ 
      lyricText: '',
      artist: '',
      song: '',
      link: '',
      category: '',
    });

    event.preventDefault();
  };

  onEditLyric = (lyric, lyricText) => {
    this.props.firebase.lyric(lyric.uid).set({
      ...lyric,
      lyricText,
      artist,
      song,
      link,
      category,
    });
  };

  onRemoveLyric = uid => {
    this.props.firebase.lyric(uid).remove();
  };

  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 25 }),
      this.onListenForLyrics,
    );
  };

  render() {
    const { users } = this.props;
    const { lyricText, song, artist, link, lyrics, loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {!loading && lyrics && (
              <button type="button" onClick={this.onNextPage}>
                More
              </button>
            )}

            {loading && <div>Loading ...</div>}

            {lyrics && (
              <LyricList
                lyrics={lyrics.map(lyric => ({
                  ...lyric,
                  user: users
                    ? users[lyric.userId]
                    : { userId: lyric.userId },
                }))}
                onEditLyric={this.onEditLyric}
                onRemoveMessage={this.onRemoveLyric}
              />
            )}

            {!lyrics && <div>There are no lyrics ...</div>}

            <form
              onSubmit={event =>
                this.onCreateLyric(event, authUser)
              }
            >
              <input
                type="text"
                value={text}
                onChange={this.onChangeText}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Messages);
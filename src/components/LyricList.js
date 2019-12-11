import React from 'react';

import LyricItem from './LyricItem';

const LyricList = ({
  lyrics,
  onEditLyric,
  onRemoveLyric,
}) => (
  <div className="row">
        <div className="col-xl-12">
          <table id="lyricsTable" className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Lyric</th>
                <th scope="col">Song</th>
                <th scope="col">Artist</th>
                <th scope="col">Song Link</th>
                <th scope="col">Category</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
                {lyrics.map(lyric => (
                  <LyricItem
                    key={lyric.uid}
                    lyric={lyric}
                    onEditLyric={onEditLyric}
                    onRemoveLyric={onRemoveLyric}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </div>
  
);

export default LyricList;
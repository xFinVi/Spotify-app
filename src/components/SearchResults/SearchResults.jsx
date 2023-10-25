import React from 'react';
import Track from '../Track/Track'; // Import the Track component
import './searchResult.css'; 

function SearchResult(props) {
  const { tracks } = props;

  // Check if tracks is defined before mapping over it
  if (!tracks) {
    return null; // You can also return a message or component to handle the undefined case
  }

  return (
    <div className="container">
      <div className="search-results  row row-cols-4">
        {tracks.map((track) => (
          <Track
            key={track.id}
            track={track}
            addTrackToPlaylist={props.addTrackToPlaylist}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchResult;

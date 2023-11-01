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
      <div className="search-results  row ">
        {tracks.map((track) => (
          <div className="col-6 col-sm-4 col-md-4 col-lg-2"   key={track.id}>
              <Track
          
            track={track}
            addTrackToPlaylist={props.addTrackToPlaylist}
          />
          </div>
        
        ))}
      </div>
    </div>
  );
}

export default SearchResult;

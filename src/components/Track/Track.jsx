import React from "react";
import "./track.styles.css";
import { IoAddCircleOutline,IoRemoveCircleOutline } from "react-icons/io5";

function Track(props) {
  const { track, isRemoval, onRemove, addTrackToPlaylist } = props;

  const renderAction = () => {
    if (isRemoval) {
      return (
      
          <IoRemoveCircleOutline className="btn-track btn-danger" onClick={() => onRemove(track)} />
    
      );
    } else {
      return (
        
          <IoAddCircleOutline className="btn-track" onClick={() => addTrackToPlaylist(track)}/>
       
      );
    }
  };


  return (
    <div className="track">
      <img className="w-100" src={track.album.images[0].url} alt={track.name} />

      <div className="track-details flex-column">
        <h3>{track.name}</h3>
        <p>{track.artists[0].name}</p>
        <div className="w-100 d-flex justify-content-between align-items-center">
          <p>{track.album.name}</p>
          {renderAction()}
        </div>
      </div>
    </div>
  );
}

export default Track;

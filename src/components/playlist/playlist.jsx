/* eslint-disable react/prop-types */
import { BiSave } from "react-icons/bi";
import { useState } from "react";
import './playlist.css';
import { CiCircleRemove } from "react-icons/ci";

function Playlist(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(props.playlist.name);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    closeMenu();
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    props.updatePlaylistName(props.index, editedName);
  };

  const handleDeleteClick = () => {
    closeMenu();
    props.deletePlaylist(props.index); // Pass the index of the playlist to delete
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };



  return (
    <div className="playlist">
    
        <h2 className="playlist-title"
          onClick={() => setIsEditing((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          {editedName}
        </h2>
        {isEditing && (
          <div className="btn-playlist">
            
              <CiCircleRemove className="btn-remove" onClick={handleDeleteClick}/>
          
          </div>
        )}
    
      {isEditing ? (
        <>
          <div>
            <input type="text" value={editedName} onChange={handleNameChange} />
            <button className="btn btn-primary" onClick={handleSaveClick}>
              <BiSave />
            </button>
          </div>
        </>
      ) : (
        < >
         {props.playlist.tracks.map((track, index) => (
  <div className="playlist-track" key={index}>
    <div className="playlist-details">
      <h3>{track.name}</h3>
      <small>{track.artists[0].name}</small>
    </div>   
     
    
      <CiCircleRemove   className="btn-del"  onClick={() => props.deleteTrackFromPlaylist(track)}/>
    
  </div>
))}
        </>
      )}
    </div>
  );
}

export default Playlist;

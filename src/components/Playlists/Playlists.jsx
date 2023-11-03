import React, { useState } from "react";
import Playlist from "../playlist/playlist";
import './playlist.css';
import { HiSaveAs } from "react-icons/hi";
import { MdPlaylistAdd,MdLogout } from "react-icons/md";

function Playlists(props) {
  const [creatingNewPlaylist, setCreatingNewPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const {addPlaylistAndTracks } = props;
  const createNewPlaylist = () => {
    // Display the input field when the button is clicked
    setCreatingNewPlaylist(true);
  };

  const handleNewPlaylistNameChange = (e) => {
    // Update the new playlist name as the user types
    setNewPlaylistName(e.target.value);
  };

  const saveNewPlaylist = () => {
    // Handle saving the new playlist with the entered name
    const newPlaylist = {
      name: newPlaylistName,
      tracks: [],
    };

    // Call the addPlaylist function from props to add the new playlist
    props.addPlaylist(newPlaylist);

    // Reset the input field and hide it
    setNewPlaylistName("");
    setCreatingNewPlaylist(false);
  };

  

  return (
    <div className="playlists ">
   
      {props.playlists.map((playlist, index) => (
        <Playlist
          key={index}
          playListName={playlist.name}
          playlist={playlist}
          playlistTracks={props.playlistTracks}
          index={index} // Pass the index of the playlist
          updatePlaylistName={props.updatePlaylistName}
          deleteTrackFromPlaylist={props.deleteTrackFromPlaylist}
          deletePlaylist={props.deletePlaylist}
        />
      ))}
      <div className="buttons">
      <button className="btn-save mt-3 mb-3" onClick={addPlaylistAndTracks}>
      <HiSaveAs />
      </button>
      {creatingNewPlaylist ? (
       
       <div>
         <input
           type="text"
           value={newPlaylistName}
           onChange={handleNewPlaylistNameChange}
           placeholder="Enter Playlist Name"
         />
         <button className="btn-save btn-primary" onClick={saveNewPlaylist}>
           Save
         </button>
       </div>
     ) : (
     
       <button className="btn-create" onClick={createNewPlaylist}>
         <MdPlaylistAdd/>
       </button>
     )}

      </div>

  

    </div>
  );
}

export default Playlists;

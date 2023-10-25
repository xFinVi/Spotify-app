import { useState, useEffect } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import SearchBar from "./components/SearchBar/searchBar";
import SearchResult from "./components/SearchResults/SearchResults";
import Playlists from "./components/Playlists/Playlists";

import "bootstrap/dist/css/bootstrap.min.css";

const CLIENT_ID = import.meta.env.VITE_REACT_APP_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_REACT_APP_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_REACT_APP_REDIRECT_URI;

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";




function App() {
  const [playListName, setPlaylistName] = useState(""); // playlist name
  const [playlistTracks, setPlaylistTracks] = useState([]); // tracks in the playlist
  const [playlists, setPlaylists] = useState([
    { id: uuidv4(), name: "Playlist 1", tracks: [] },
  ]);
  const [searchResult, setSearchResult] = useState(""); // Initialize with initial tracks
  const [token, setToken] = useState(""); // SPOTIFY ACCESS <TOKEN></TOKEN>
  const [albums, setAlbums] = useState([]); // ALBUMS we got  from the API

  const [user_id, setUser_id] = useState("");// Add user_id state
  const playlistName = playlists[0].name; // Replace with your desired playlist name.
  const trackURIS = playlists[0].tracks.map((track) => track.uri); // Replace with the actual track URIs you want to add.


  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
  
    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];
      window.localStorage.setItem("token", token);
    }
  
    getUserId(token)
      .then((userId) => {
        if (userId) {
          // Set the obtained user ID to the user_id variable
          setUser_id(userId);
        } else {
          console.log('Failed to retrieve user ID.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  
    setToken(token);
  }, [user_id]);


  

  const updatePlaylistName = (index, name) => {
    const updatedPlaylists = [...playlists];
    updatedPlaylists[index].name = name;
    setPlaylists(updatedPlaylists);
  };

  const createNewPlaylist = () => {
    if (playListName.trim() === "") {
      return; // Prevent creating an empty-named playlist
    }

    // Create a new playlist object with the name from playListName
    const newPlaylist = {
      name: playListName,
      tracks: [],
    };

    // Create a new copy of the playlists array and add the new playlist
    const updatedPlaylists = [...playlists, newPlaylist];

    // Update the state with the new copy and reset playListName
    setPlaylists(updatedPlaylists);
    setPlaylistName("");
  };

  // Pass this function as a prop
  const addPlaylist = () => {
    const newPlaylist = { id: uuidv4(), name: "New Playlist", tracks: [] };

    // Create a new copy of the playlists array and add the new playlist
    const updatedPlaylists = [...playlists, newPlaylist];

    // Update the state with the new copy
    setPlaylists(updatedPlaylists);
  };

  const addTrackToPlaylist = (track) => {
    const trackURI = track.uri; // Extract the track URI
  
    // Check if the track is already in the playlist (use track URI for comparison)
    const isTrackInPlaylist = playlists[0].tracks.some((t) => t.uri === trackURI);

    if (!isTrackInPlaylist) {
      console.log("TADDING" , track);
    }
  
    if (isTrackInPlaylist) {
      console.log("Track is already in the playlist.");
      return;
    }
  
    // If the track is not in the playlist, add it to the specific playlist
    console.log("Track is not in the playlist. Adding it.");
    const updatedPlaylists = [...playlists];
    updatedPlaylists[0].tracks.push(track); // Add the entire track object to your state
    setPlaylists(updatedPlaylists);
  };
  
  const deletePlaylist = (index) => {
    const updatedPlaylists = playlists.filter((_, i) => i !== index);
    setPlaylists(updatedPlaylists);
  };

  const deleteTrackFromPlaylist = (track) => {
    const updatedTracks = playlists[0].tracks.filter((t) => t.id !== track.id);
    // Update the state with the updatedTracks
    const updatedPlaylists = [...playlists];
    updatedPlaylists[0].tracks = updatedTracks;
    setPlaylists(updatedPlaylists);
  };


  async function search() {
    if (!searchResult) {
      console.error("No search query provided.");
      return;
    }

    if (!token) {
      // Redirect the user to the Spotify authorization page to obtain an access token
      const redirectUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=playlist-modify-private&redirect_uri=${REDIRECT_URI}`;
      window.location.href = redirectUrl;
      return;
    }

    // GET Request using search to get the track results
    const searchParameters = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    // Search for tracks (type=track)
    const trackResults = await fetch(
      `https://api.spotify.com/v1/search?q=${searchResult}&type=track`,
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return data.tracks.items;
      })
      .catch((error) => {
        console.error("Error searching for tracks: " + error.message);
        return [];
      });

    // Update the state with the retrieved tracks
    setAlbums(trackResults);
  }
  
  const searchInput = (e) => {
    setSearchResult(e.target.value);
  };
  
  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
    window.location.replace("/");
  };

  async function getUserId(accessToken) {
    // Define the URL for the "Get Current User's Profile" endpoint.
    const url = 'https://api.spotify.com/v1/me';
  
    // Set up the request headers with the access token.
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
  
    try {
      // Make the GET request to obtain the user's profile.
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });
  
      if (response.ok) {
        // Parse the response as JSON.
        const userData = await response.json();
  
        // Extract and return the user's Spotify user ID.
        const userId = userData.id;
        return userId;
      } else {
        console.error('Error fetching user data:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  const createNewSpotifyPlaylist = async () => {
    const playlistData = {
      name: playlists[0].name,
      public:false

    };
  
    // Use the user_id from your state
    const userID = user_id; // Make sure you have user_id in your state
  
    try {
      const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playlistData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Playlist created:", data);
        // Handle the response, and you can also add tracks to this playlist if needed.
        const playlistId = data.id;
      
        await addTracksToPlaylist(playlistId) // Return the ID of the created playlist
      } else {
        console.error("Error creating playlist:", response.status, response.statusText);
        // Handle the error.
        return null;
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      // Handle the error.
      return null;
    }
  };


const addTracksToPlaylist = async (playlistId) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: trackURIS }),
    });

    if (response.ok) {
      console.log("Tracks added to the playlist.");
    } else {
      console.error("Error adding tracks to the playlist:", response.status);
    }
  } catch (error) {
    console.error("Error adding tracks to the playlist:", error);
  }
};



  return (
    <>
      <h1 className="mb-5">Spotify - React</h1>
      {token ? (
        <>
        <button className=" btn btn-danger" onClick={logout}>Logout</button>
      <div className="grid-container mt-5">
      
        <div className="grid-1 mx-auto">
          <SearchBar
            searchInput={searchInput}
            search={search} // Pass the search function
          />
        </div>
          <div className="grid-2">
            <Playlists
              playlistTracks={playlistTracks}
              playlists={playlists}
              updatePlaylistName={updatePlaylistName}
              deleteTrackFromPlaylist={deleteTrackFromPlaylist}
              deletePlaylist={deletePlaylist}
              addPlaylist={addPlaylist}
              createNewPlaylist={createNewPlaylist}
              addTrackToPlaylist={addTrackToPlaylist}
              addPlaylistAndTracks={createNewSpotifyPlaylist}
            />
          </div>

          <div className="grid-3">
            <SearchResult
              tracks={albums}
              addTrackToPlaylist={addTrackToPlaylist}
            />
          </div>
        
       
      </div>
      </>
      
      ) : (

        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=playlist-modify-private&redirect_uri=${REDIRECT_URI}`}> Please login </a>
      )
}




    </>
  );
}

export default App;

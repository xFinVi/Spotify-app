let accessToken = "";

const CLIENT_ID = "cb75348a498f41c98d942930d0e9a8fd";
const CLIENT_SECRET = "266bccc2224b4d669a318588393b8eee";
const REDIRECT_URI = encodeURIComponent("http://localhost:5173/");
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

    if (urlAccessToken && urlExpiresIn) {
      accessToken = urlAccessToken[1];
      const expiresIn = Number(urlExpiresIn[1]);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
    } else {
      const redirect = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
      window.location.href = redirect;
    }
  },

  async search(term) {
    accessToken = await Spotify.getAccessToken();
    console.log(accessToken);
    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.tracks) {
      return [];
    }

    return data.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }));
  },

  savePlaylist(playlistName, trackURIs) {
		if (playlistName && trackURIs.length) {
			const accessToken = Spotify.getAccessToken();
			const headers = {
				Authorization: `Bearer ${accessToken}`
			};
			let userID;
			let playlistID;
			return fetch('https://api.spotify.com/v1/me', { headers: headers })
				.then(
					(response) => {
						if (response.ok) {
							return response.json();
						}
						throw new Error('Request failed!');
					},
					(networkError) => {
						console.log(networkError.message);
					}
				)
				.then((jsonResponse) => {
					userID = jsonResponse.id;
					return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
						method: 'POST',
						headers: headers,
						body: JSON.stringify({ name: playlistName })
					})
						.then(
							(response) => {
								if (response.ok) {
									return response.json();
								}
								throw new Error('Request failed!');
							},
							(networkError) => {
								console.log(networkError.message);
							}
						)
						.then((jsonResponse) => {
							playlistID = jsonResponse.id;
							return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
								method: 'POST',
								headers: headers,
								body: JSON.stringify({ uris: trackURIs })
							})
								.then(
									(response) => {
										if (response.ok) {
											return response.json();
										}
										throw new Error('Request failed!');
									},
									(networkError) => {
										console.log(networkError.message);
									}
								)
								.then((jsonResponse) => jsonResponse);
						});
				});
		} else {
			return;
		}
	}
};

export { Spotify };







/*   const savePlaylist = () => {
    if (!playListName || playlistTracks.length === 0) {
      console.error("Playlist name or tracks are missing.");
      return;
    }
    // Extract the URIs of the tracks
    const trackUris = playlistTracks.map((track) => track.uri);

    // Use the access token to get the user's ID
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const userID = data.id;
        // Create a new playlist
        fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: playListName,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            const playlistID = data.id;

            // Add tracks to the created playlist
            fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ uris: trackUris }),
            })
              .then(() => {
                console.log("Playlist saved successfully!");
                // Optionally, you can reset the state here
                setPlaylistName("New Playlist");
                setPlaylistTracks([]);
              })
              .catch((error) => {
                console.error("Error saving playlist:", error);
              });
          })
          .catch((error) => {
            console.error("Error creating playlist:", error);
          });
      })
      .catch((error) => {
        console.error("Error getting user ID:", error);
      });
  };
 */
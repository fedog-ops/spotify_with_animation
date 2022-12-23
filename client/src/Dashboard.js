import { useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import useAuth from "./useAuth";
import TrackSearchResult from "./TrackSearchResult";
import SpotifyWebApi from "spotify-web-api-node";
import Player from "./Player";

const spotifyApi = new SpotifyWebApi({
  clientId: 'c6212b6f131f46ea8b9c6305ae202a7d',
})

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([])

  const [playingTrack, setPlayingTrack] = useState()

  function choseTrack(track) {
  setPlayingTrack(track)
  setSearch('')
      }
//give accessToken to API
  useEffect(() => {
    if(!accessToken)return
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);
//search tracks
useEffect(() => {
  if(!searchResults)return setSearchResults([])
  if(!accessToken)return

  let cancel = false
  spotifyApi.searchTracks(search).then((data) => {
    
      if (cancel) return
    setSearchResults(
      data.body.tracks.items.map(track => {
        const smallestAlbumImage = track.album.images.reduce(
          (smallest, image) => {
            if (image.height < smallest.height) return image
            return smallest
          },
          track.album.images[0]
          ) 

        return {
          artist: track.artists[0].name,
          title: track.name,
          uri: track.uri,
          albumUrl: smallestAlbumImage.url,
        }
      })
    )


  })
},[search, searchResults])

  return (
    <Container className="d-flex flex-column py-2" style={{heigh: "100vh"}}>
      <Form.Control
        type="search"
        placeholder="Search songs/artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      ></Form.Control>

<div className="flex-grow-1 my-2" style={{overflowY: "auto"}}>
    {searchResults.map(track => (
      <TrackSearchResult key={track.uri} track={track} choseTrack={choseTrack}/>
    ))}
</div>

    {/* <div> RequestToken: {accessToken}</div>  */}
    <div><Player accessToken={accessToken} trackUri={playingTrack?.uri}/></div>
    </Container>
  );
}
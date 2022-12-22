const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.post('/', async (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    })

    spotifyApi.authorizationCodeGrant(code)
    .then((data) => {
        res.json({
            accessToken: data.body['access_token'],
            refreshToken: data.body['refresh_token'],
            expiresIn: data.body['expires_in']
        })
    }).catch((error) => {
        res.sendStatus(400)
    })
})
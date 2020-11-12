require('dotenv').config();

const express       = require('express');
const hbs           = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

    spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get('/', (req, res, next) => {
    res.render('home')
})

app.get('/artist-search' , (req, res, next) => {

    const artistSearch = req.query.artist

    spotifyApi
        .searchArtists(artistSearch)
        .then(data => {
            // console.log('The received data from the API: ', data.body.artists.items.id);
            res.render('artistSearchResults', {artist: data.body.artists.items})
        })
        .catch(error => console.log('The error while searching artists occurred: ', error));
})

app.get('/albums/:id', (req, res, next) => {
   
    const artistId = req.params.id

    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            // console.log('The received data from the API: ', data.body.items);
            res.render('albums', {artistId: data.body.items})
        })
        .catch(error => console.log('The error while searching albums occurred: ', error))
});

app.get('/tracks/:id', (req, res, next) => {
   
    const albumID = req.params.id

    spotifyApi
        .getAlbumTracks(albumID)
        .then(data => {
            // console.log('The received data from the API: ', data.body.items);
            res.render('tracks', {tracks: data.body.items})
        })
        .catch(error => console.log('The error while searching albums occurred: ', error))
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

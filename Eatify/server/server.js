// Set up
var express  = require('express');
var Twitter = require('twitter');
var Yelp = require('yelp');
var app = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
// Configuration
var client = new Twitter({
  consumer_key: 'Xt9AvoPn96HnsdH55cpZeq6iR',
  consumer_secret: 'fMNHwvXGK4pUDEUzlOzxY4JhSWd8djRG95GZQW14KJ9AWD4cdK',
  access_token_key: '96027197-trS74mfDl8g2FWT8UklH1VLRRgXZEOkXk3kxC9HQL',
  access_token_secret: 'TFHwQKESnExx3YVqvftMe4rtweFPgAFlEGx1MN9rCiTid'
});
var yelp = new Yelp({
  consumer_key: 'mygJi6gpNFI7GUo-16LpTg',
  consumer_secret: 'yPxNeguI97vNmgLElWC60ebFPxk',
  token: '53Ef3ja9CyDUeIU-4_ftkf4TBDQMxk3E',
  token_secret: 'wzInled2ymn6aLBJfrdv6_fZ2wc',
});
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//get all tweets from user
app.get('/tweets/:username', function(req, res) {
  var allTweets = '';
  client.get('statuses/user_timeline', {screen_name: req.params.username},  function(error, tweet, response) {
    if(error) {
      res.send(error);
    }
    else {
      res.json(checkPopularity(tweet));
    }
  });
})
function checkPopularity(tweets) {
  allTweets = [];
  for (var i = 0, len = tweets.length; i < len; i++) {
    if(tweets[i].entities.hashtags) {
      allTweets = allTweets.concat(tweets[i].entities.hashtags);
    }
  }
  return allTweets;
}

app.post('/getplaces', function(req, res) {
  yelp.search({ term: req.body.places , location: req.body.location})
  .then(function (data) {
    res.json(data);
  })
  .catch(function (err) {
    res.send(err);
  });
})


// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");

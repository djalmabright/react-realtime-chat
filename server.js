var express = require('express');
var bodyParser = require('body-parser');
var Pusher = require('pusher');
var env = require('node-env-file');
env(__dirname + '/.env');

var pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: true
});

var app = express();
app.use(express.static(__dirname + '/templates'));

app.get('/', function(req, res) {
  res.render('index.html');
});

// app.post('/auth', bodyParser.urlencoded({ extended: true }), function (req, res) {
//   pusher.authenticate(req, res, {
//     userID: req.query["user_id"],
//   });
// });


app.post('/messages',bodyParser.urlencoded({ extended: true }), function (req, res) {  
  try {
    pusher.trigger('messages', 'new_message', {
      'text': req.body.text, //escape text from html
      'name': req.body.name,
      'time': req.body.time
    })
    console.log("Successfully appended", req.body.text, "to the playground feed");
    res.sendStatus(204);
  } catch (error) {
    console.log("Error while appending to the playground feed:", e);
    res.sendStatus(500);
  }
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Pusher Platform auth example listening on port ' + port);
});
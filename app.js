var express = require('express'),
    cookieParser=require('cookie-parser'),
    bodyParser=require('body-parser'),
    multer = require('multer'),
    morgan = require('morgan'),
    app = new express();

app.use(express.static(__dirname+"/public"));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  var handler = multer({
    dest: './public/images/avatar/',
    rename: function(fieldname, filename, req, res, next) {
      return (req.username || 'username');
    },
    onFileUploadComplete: function(file, req, res) {
      console.log('a');
      next();
    }
  });
  console.log((req.file));
  handler(req, res, next);
});




app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.post('/upload', function(req, res) {
  console.log(req.body);
  console.log(req.query);
  console.log('b');
  res.status(200).end('Upload Completed!');
});


app.listen(3001, 'localhost', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Node Server listening on http://localhost:3001/")
  }
})

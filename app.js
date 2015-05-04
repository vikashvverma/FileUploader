var express = require('express'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  multer = require('multer'),
  morgan = require('morgan'),
  app = new express();

app.use(express.static(__dirname + "/public"));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  var handler = multer({
    dest: './public/images/avatar/',
    rename: function(fieldname, filename, req, res, next) {
      return filename;
    },
    onParseEnd: function(req, next) {
      console.log('File Uploaded!')
      next();
    },
    onError: function(err, next) {
      return res.status(500).send({status:false,info:"File could not be uploaded;"});
    }
  });
  handler(req, res, next);
});




app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.post('/upload', function(req, res) {
  console.log("Send success message!");
  res.status(200).send({status:true,info:'File successfully uploaded!'});
});


app.listen(process.env.PORT || 3000);

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('express-cors');
var fs = require('fs');
var compression = require('compression');
var helmet = require('helmet');
var formidable = require('formidable');
var multer = require('multer');

var app = express();
app.use(compression());
app.use(helmet());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger({
  format: ':remote-addr :method :url' ,
  stream: fs.createWriteStream('app.log', {'flags': 'w'})
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/build'))

app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})

const storage = multer.diskStorage({
  destination: './build/encryption/',
  filename: (req, file, cb) => {
    cb(null, 'NeedToEncryption.txt')
  }
})

const upload = multer({storage: storage});

app.post('/api/uploadToEncryption', upload.single('file'), (req, res, next) => {
  if (!req.file) {
    res.send(new Error());
  }
  let {keys} = req.body;
  fs.readFile('./build/encryption/NeedToEncryption.txt', (err, data) => {
    if(err) throw err;
    if(data.length === 0) res.send('Encryption completed!')
    let initialVector = new Array(64);
    for (let i = 0; i < 64; ++i) initialVector[i] = 0;
    let clearText64bits = new Array(64);
    for (let i = 0; i < data.length; ++i) {
      for (let j = 0; j < 8; ++j) {
        clearText64bits[i * 8 + j] = data[i] & 1;
        data[i] >>= 1;
      }
      if (i % 8 === 7) {
        for (let j = 0; j < 64; ++j) clearText64bits[j] ^= initialVector[j];
        // TODO: realize the algorithm DES
      }
    }
    res.send();
  })
})

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

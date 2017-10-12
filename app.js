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

app.get('/', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'build', 'index.html'));
})

app.get('/build/encryption/EncryptedFile', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'encryption', 'EncryptedFile'));
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
    let resultBuffer = new Buffer((data.length + 7) / 8 * 8);
    let table5 = [
      58, 50, 42, 34, 26, 18, 10, 2,
      60, 52, 44, 36, 28, 20, 12, 4,
      62, 54, 46, 38, 30, 22, 14, 6,
      64, 56, 48, 40, 32, 24, 16, 8,
      57, 49, 41, 33, 25, 17, 9, 1,
      59, 51, 43, 35, 27, 19, 11, 3,
      61, 53, 45, 37, 29, 21, 13, 5,
      63, 55, 47, 39, 31, 23, 15, 7
    ], table6 = [
      32, 1, 2, 3, 4, 5, 4, 5,
      6, 7, 8, 9, 8, 9, 10, 11,
      12, 13, 12, 13, 14, 15, 16, 17,
      16, 17, 18, 19, 20, 21, 20, 21,
      22, 23, 24, 25, 24, 25, 26, 27,
      28, 29, 28, 29, 30, 31, 32, 1
    ], table7 = [
      15, 3, 1, 13, 8, 4, 14, 7,
      6, 15, 11, 2, 3, 8, 4, 15,
      9, 12, 7, 0, 2, 1, 13, 10,
      12, 6, 0, 9, 5, 11, 10, 5,
      0, 13, 14, 8, 7, 10, 11, 1,
      10, 3, 4, 15, 13, 4, 1, 2,
      5, 11, 8, 6, 12, 7, 6, 12,
      9, 0, 3, 5, 2, 14, 15, 9
    ], table8 = [
      16, 7, 20, 21, 29, 12, 28, 17,
      1, 15, 23, 26, 5, 18, 31, 10,
      2, 8, 24, 14, 32, 27, 3, 9,
      19, 13, 30, 6, 22, 11, 4, 25
    ], table9 = [
      40, 8, 48, 16, 56, 24, 64, 32,
      39, 7, 47, 15, 55, 23, 63, 31,
      38, 6, 46, 14, 54, 22, 62, 30,
      37, 5, 45, 13, 53, 21, 61, 29,
      36, 4, 44, 12, 52, 20, 60, 28,
      35, 3, 43, 11, 51, 19, 59, 27,
      34, 2, 42, 10, 50, 18, 58, 26,
      33, 1, 41, 9, 49, 17, 57, 25
    ]
    for (let j = 0; j < 64; ++j) clearText64bits[j] = 0;
    let algorithmDES = (i) => {
      for (let j = 0; j < 64; ++j) clearText64bits[j] ^= initialVector[j];
      let left = new Array(32), right = new Array(32);
      for (let round = 0; round < 6; ++round) {
        if(round === 0) {
          for (let j = 0; j < 32; ++j) {
            left[j] = clearText64bits[table5[j] - 1];
            right[j] = clearText64bits[table5[j + 32] - 1];
          }
        }
        let extendedRight = new Array(48);
        for (let j = 0; j < 48; ++j) extendedRight[j] = right[table6[j] - 1] ^ keys[round][j];
        let right2 = new Array(32);
        for (let j = 0; j < 8; ++j) {
          let number = 0;
          for (let k = 0; k < 6; ++k) number = (number << 1) | extendedRight[j * 8 + k];
          number = table7[number];
          for (let k = 0; k < 4; ++k) {
            right2[j * 4 + k] = number & 1;
            number >>= 1;
          }
        }
        if (round < 5) {
          let right3 = new Array(32);
          for (let j = 0; j < 32; ++j) right3[j] = right2[table8[j] - 1];
          let tmpLeft = new Array(64);
          for (let j = 0; j < 32; ++j) tmpLeft[j] = left[j];
          left = right;
          for (let j = 0; j < 32; ++j) right[j] = tmpLeft[j] ^ right3[j];
        }
      }
      for (let j = 0; j < 64; ++j) clearText64bits[j] = 0;
      let tmpArray = new Array(64);
      for (let j = 0; j < 32; ++j) {
        tmpArray[j] = left[j];
        tmpArray[j + 32] = right[j];
      }
      let array = new Array(64);
      for (let j = 0; j < 64; ++j) array[j] = tmpArray[table9[j] - 1];
      let number = 0;
      for (let j = 0; j < 32; ++j) {
        number = (number << 1) | array[j];
        initialVector[j] = left[j];
      }
      for (let j = 0; j < 4; ++j) {
        resultBuffer[i / 8 * 8 + j] = number & 0xff;
        number >>= 8;
      }
      number = 0;
      for (let j = 0; j < 32; ++j) {
        number = (number << 1) | array[j + 32];
        initialVector[j + 32] = right[j];
      }
      for (let j = 0; j < 4; ++j) {
        resultBuffer[i / 8 * 8 + j + 4] = number & 0xff;
        number >>= 8;
      }
    }
    for (let i = 0; i < data.length; ++i) {
      for (let j = 0; j < 8; ++j) {
        clearText64bits[i * 8 + j] = data[i] & 1;
        data[i] >>= 1;
      }
      if (i % 8 === 7) algorithmDES(i);
    }
    if (data.length % 8 !== 0) algorithmDES(data.length - 1);
    fs.writeFile('./build/encryption/EncryptedFile', resultBuffer, err => {
      if (err) throw err;
      res.send('Encryption successfully!');
    })
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

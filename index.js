const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const axios = require('axios');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // @note uploads/ is a folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // @note file will be saved with original name
  }
});
const upload = multer({ storage });

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(morgan('dev'));

app.get('/api/test', (req, res) => {
  console.log('------------------------------------');
  console.log('headers:', JSON.stringify(req.headers, null, 2));
  console.log('query:', JSON.stringify(req.query, null, 2));
  console.log('body:', JSON.stringify(req.body, null, 2));
  console.log('params:', JSON.stringify(req.params, null, 2));
  console.log('------------------------------------');
  return res.json({ message: 'Hi! from::/api/test' });
});

app.get('/api/node-fetch', async (req, res) => {
  console.log('------------------------------------');
  console.log('headers:', JSON.stringify(req.headers, null, 2));
  console.log('query:', JSON.stringify(req.query, null, 2));
  console.log('body:', JSON.stringify(req.body, null, 2));
  console.log('params:', JSON.stringify(req.params, null, 2));
  console.log('------------------------------------');
  const pdf = fs.readFileSync('./pdf/sample.pdf');
  const form = new FormData();
  form.append('firstName', 'John');
  form.append('lastName', 'Doe');
  form.append('document', pdf, `sample-${new Date().toISOString()}.pdf`);
  // form.append('document', fs.createReadStream('./pdf/sample.pdf'), `sample-${new Date().toISOString()}.pdf`);
  // form.append('document', fs.createReadStream('./pdf/sample.pdf'));
  const response = await fetch('http://localhost:3001/api/documents', {
    method: 'POST',
    // @note headers are not required
    // headers: {
    //   'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`
    // },
    body: form
  });
  console.log(await response.json())
  return res.json({ message: 'Hi! from::/api/node-fetch' });
})

app.get('/api/axios', async (req, res) => {
  console.log('------------------------------------');
  console.log('headers:', JSON.stringify(req.headers, null, 2));
  console.log('query:', JSON.stringify(req.query, null, 2));
  console.log('body:', JSON.stringify(req.body, null, 2));
  console.log('params:', JSON.stringify(req.params, null, 2));
  console.log('------------------------------------');
  const pdf = fs.readFileSync('./pdf/sample.pdf');
  const form = new FormData();
  form.append('firstName', 'John');
  form.append('lastName', 'Doe');
  form.append('document', pdf, `sample-${new Date().toISOString()}.pdf`);

  url = 'http://localhost:3001/api/documents';
  const response = await axios.post(url, form);
  console.log(response.data);
  return res.json({ message: 'Hi! from::/api/axios' });
});

app.post('/api/documents', upload.single('document'), (req, res) => {
  console.log('------------------------------------');
  console.log('headers:', JSON.stringify(req.headers, null, 2));
  console.log('query:', JSON.stringify(req.query, null, 2));
  console.log('body:', JSON.stringify(req.body, null, 2));
  console.log('params:', JSON.stringify(req.params, null, 2));
  console.log('------------------------------------');
  // @todo get form data
  if (req.file) {
    console.log('File uploaded!');
  }
  return res.json({ message: 'Hi! from::/api/documents' });
});

app.listen(3001, () => {
  console.log('Server is running on port http://localhost:3001');
});
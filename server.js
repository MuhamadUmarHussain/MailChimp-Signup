const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve files from the 'web' directory
app.use(express.static(path.join(__dirname, 'web')));

// Serve files from the 'Images' directory
app.use('/Images', express.static(path.join(__dirname, 'Images')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'signUp.html'));
});

app.post('/', (req, res) => {
  const f_n = req.body.first_name;
  const l_n = req.body.Last_name;
  const E_m = req.body.Email;

  const data = {
    members: [
      {
        email_address: E_m,
        status: 'subscribed',
        merge_fields: {
          FNAME: f_n,
          LNAME: l_n,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  // const url = 'Add your API end point like this : https://usX.api.mailchimp.com/3.0/lists/ and replace 'X' with version you have / your user unique id';
  const options = {
    method: 'POST',
    // auth: 'anystring: Here Add Your Api Key. and whatever last us version you have replace in above',
  };

  const request = https.request(url, options, (response) => {
    let responseBody = '';

    response.on('data', (chunk) => {
      responseBody += chunk;
    });

    response.on('end', () => {
      if (response.statusCode === 200) {
        res.sendFile(path.join(__dirname, 'web', 'sucess.html'));
      } else {
        console.error(`Failed to subscribe: ${response.statusCode}`);
        console.error(responseBody);
        res.sendFile(path.join(__dirname, 'web', 'failure.html'));
      }
    });
  });

  request.on('error', (e) => {
    console.error(`Request error: ${e.message}`);
    res.send('There was an error with the request.');
  });

  request.write(jsonData);
  request.end();
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.listen(process.env.port || 3000, () => {
  console.log('Server started on port 3000');
});

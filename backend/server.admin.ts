const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");

import routes from './rest/routes/routes';

// Middleware for parsing JSON requests
app.use(bodyParser.json());

const http = require('http');
const PORT = process.env.PORT || 5000;

app.use(cors());
// app.use(express.static('public'));

const dbName = 'prodfin';
const atlas = 'mongodb+srv://admin:root@cluster0.ps6r0dq.mongodb.net/' + dbName; 
const HOST = 'localhost';
const db = atlas;

mongoose.connect(db, {
  dbName: dbName,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to database!");
  console.log("");
  console.log("");
})
.catch((err: any) => console.error(err));

// mongoose.set('useFindAndModify', false);

const main = async () => {
  // app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use((req: any, res: any, next: any) => {
    const authorId = req.get('authorId');
    if (!authorId) {
      return res.status(400).json({ message: "Header 'authorId' is missing" });
    }

    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS method headers
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept');
    
    return next();
  });

  const path = '/bp';
  app.use(path, routes);

  app.use((req: any, res: any, next: any) => {
    const error = new Error('not found');
    return res.status(404).json({
      message: error.message
    });
  });

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`🚀 started server at http://${HOST}:${PORT}${path}`);
  });
};

main();

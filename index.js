const express = require('express');
const cors = require('cors');
const router = require('./src/routes');
require('dotenv').config()

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.use('/api/v1/', router);

app.listen(port, () => console.log(`Server Running on Port: ${port}!`));
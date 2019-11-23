const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db');
const retroRouter = require('./routes/retro.router');
const itemRouter = require('./routes/item.router');

const PORT = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use('/api', retroRouter);
app.use('/api', itemRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
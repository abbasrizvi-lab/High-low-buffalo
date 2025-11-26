require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const reflectionsRouter = require('./routes/reflections');
const usersRouter = require('./routes/users');
const herdsRouter = require('./routes/herds');
const connectionsRouter = require('./routes/connections');
const reactionsRouter = require('./routes/reactions');
const remindersRouter = require('./routes/reminders');

const authRouter = require('./routes/auth');

app.use('/api/reflections', reflectionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/herds', herdsRouter);
app.use('/api/connections', connectionsRouter);
app.use('/api/reactions', reactionsRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
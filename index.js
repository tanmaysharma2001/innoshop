const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// during uncaught exceptions, the node application goes
// into what's called unclean state
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! ✨ SHUTTING DOWN...');
  console.log(err.name, err.message);

  process.exit(1);
});


const app = require('./app');

const DB = process.env.DATABASE_URI.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
  useNewUrlParser: true
}).then(() => {
  console.log('Database connection established successfully!');
});

// Start Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! ✨ SHUTTING DOWN...');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  })
});

const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  console.log(err.stack)
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
if (port != 443 && port != 3001) {
const server = app.listen(port, () => {
  console.log(`App running at port ${port}...`);
});
} else {
    var https = require('https');
    var fs = require('fs');
    credentials = {
        key: fs.readFileSync(process.env.SSL_KEY), cert: fs.readFileSync(process.env.SSL_CERT)
    }
    https.createServer(credentials, app).listen(port, () => {
      console.log(`App running at port ${port}...`);
    });
}

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

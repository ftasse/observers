const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '../config.env' });

const Topic = require('../models/topicModel');

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
  .then(() => {
    console.log('Connection to DB successful');
  });

const topics = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'dev-data/topics-simple.json'), 'utf-8')
);

const loadData = async () => {
  try {
    await Topic.create(topics);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Topic.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
};

(async () => {
  if (process.argv[2] === '--import') {
    await loadData();
  } else if (process.argv[2] === '--delete') {
    await deleteData();
  }
})();

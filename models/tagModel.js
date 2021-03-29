const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'A tag must have a name'],
    minLength: [5, 'A tag must have at least 5 characters'],
    maxLength: [30, 'A tag must have at most 30 characters']
  }
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;

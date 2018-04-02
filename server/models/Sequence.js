const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sequenceSchema = new mongoose.Schema({
  date: {type: Number},
  seq: { type: Number},
  type: {type: String}
}, {
  timestamps: true
});

const Sequence = mongoose.model('Sequence', sequenceSchema);

module.exports = Sequence;
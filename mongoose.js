var mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/TodoApp';

//tell mongoose we're using promises
mongoose.Promise = global.Promise;

//mongoose doesn't require the same callback function as mongo's default connect
mongoose.connect(url);

module.exports = {mongoose};

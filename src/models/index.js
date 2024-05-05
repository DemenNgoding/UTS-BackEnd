const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const schema = require('./schema');

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const User = mongoose.model('users', mongoose.Schema(schema.usersSchema));
const Warehouse = mongoose.model(
  'warehouse',
  mongoose.Schema(schema.warehouseSchema)
);

module.exports = {
  mongoose,
  User,
  Warehouse,
};

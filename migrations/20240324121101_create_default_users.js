const logger = require('../src/core/logger')('api');
const schema = require('../src/models');
const { hashPassword } = require('../src/utils/password');

const name = 'Administrator';
const email = 'admin@example.com';
const password = '123456';
const buah = 'apel';
const total = 10;
const kategori = 'buah';

logger.info('Creating default users');

(async () => {
  try {
    const numUsers = await schema.User.countDocuments({
      name,
      email,
    });

    if (numUsers > 0) {
      throw new Error(`User ${email} already exists`);
    }

    const hashedPassword = await hashPassword(password);
    await schema.User.create({
      name,
      email,
      password: hashedPassword,
    });

    // membuat colection gudang
    await schema.Warehouse.create({
      namaBarang: buah,
      jumlah: total,
      kategori,
    });
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit(0);
  }
})();

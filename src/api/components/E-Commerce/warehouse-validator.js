const joi = require('joi');

module.exports = {
  createProducts: {
    body: {
      namaBarang: joi.string().min(1).max(1000).required().label('Nama-Produk'),
      jumlah: joi.number().min(1).max(1000).required().label('Jumlah-Produk'),
      kategori: joi
        .string()
        .min(1)
        .max(1000)
        .required()
        .label('kategori-Produk'),
    },
  },

  updateProducts: {
    body: {
      namaBarang: joi.string().min(1).max(1000).required().label('Nama-Produk'),
      jumlah: joi.number().min(1).max(1000).required().label('Jumlah-Produk'),
      kategori: joi
        .string()
        .min(1)
        .max(1000)
        .required()
        .label('kategori-Produk'),
    },
  },
};

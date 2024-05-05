// const { Toko } = require('../../../models');
const { Warehouse } = require('../../../models');

/**
 * Create new products
 * @param {string} namaBarang - Nama Barang
 * @param {Number} jumlah - Jumlah
 * @param {String} kategori - kategori
 * @returns {Promise}
 */
async function createProducts(namaBarang, jumlah, kategori) {
  return Warehouse.create({
    namaBarang,
    jumlah,
    kategori,
  });
}

/**
 * get product by name to prevent duplicate product
 * @param {string} namaProduk
 * @returns {Promise}
 */
async function getProductByName(namaProduk) {
  return Warehouse.findOne({ namaProduk });
}

/**
 * Delete product
 * @param {string} id
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Warehouse.deleteOne({ _id: id });
}

/**
 * Get product
 * @returns {Promise}
 */
async function getProducts() {
  return Warehouse.find({});
}

/**
 * Get product by id
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getProductById(id) {
  return Warehouse.findById(id);
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} namaBarang - Name
 * @param {Number} jumlah
 * @param {string} kategori
 * @returns {Promise}
 */
async function updateProduct(id, namaBarang, jumlah, kategori) {
  return Warehouse.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        namaBarang,
        jumlah,
        kategori,
      },
    }
  );
}

module.exports = {
  createProducts,
  getProducts,
  getProductById,
  deleteProduct,
  getProductByName,
  updateProduct,
};

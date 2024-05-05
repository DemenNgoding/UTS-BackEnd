const { func } = require('joi');
const warehouseRepository = require('./warehouse-repository');

/**
 * Create product
 * @param {string} namaBarang - Nama barang
 * @param {Number} jumlah - jumlah barang
 * @param {string} kategori - kategori
 * @returns {boolean}
 */
async function createProducts(namaBarang, jumlah, kategori) {
  try {
    await warehouseRepository.createProducts(namaBarang, jumlah, kategori);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * cek apakah produk sudah ada didalam database atau belum
 * @param {string} namaProduk
 * @returns {boolean}
 */
async function isProductAdded(namaProduk) {
  const produk = await warehouseRepository.getProductByName(namaProduk);

  if (produk) {
    return true;
  }

  return false;
}

/**
 * Get product
 * @returns {Array}
 */
async function getProducts() {
  const barang = await warehouseRepository.getProducts();

  const results = [];
  for (let i = 0; i < barang.length; i += 1) {
    const data = barang[i];
    results.push({
      namaBarang: data.namaBarang,
      jumlah: data.jumlah,
      kategori: data.kategori,
    });
  }

  return results;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deteleProduct(id) {
  const products = await warehouseRepository.getProductById(id);

  // product not found
  if (!products) {
    return null;
  }

  try {
    await warehouseRepository.deleteProduct(id);
  } catch (err) {
    return null;
  }

  return true;
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
  const product = await warehouseRepository.getProductById(id);

  if (!product) {
    return null;
  }

  try {
    await warehouseRepository.updateProduct(id, namaBarang, jumlah, kategori);
  } catch (arr) {
    return true;
  }

  return true;
}

module.exports = {
  createProducts,
  isProductAdded,
  getProducts,
  deteleProduct,
  updateProduct,
};

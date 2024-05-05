const warehouseService = require('./warehouse-services');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle create product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createProduct(request, response, next) {
  try {
    const namaProduk = request.body.namaBarang;
    const totalProduk = request.body.jumlah;
    const kategoriProduk = request.body.kategori;

    // mencegah nama yang sama pada database
    const barangAda = await warehouseService.isProductAdded(namaProduk);
    console.log(barangAda);
    if (barangAda) {
      throw errorResponder(
        errorTypes.PRODUCT_ALREADY_ADD,
        'Barang sudah ada di dalam database'
      );
    }

    const success = await warehouseService.createProducts(
      namaProduk,
      totalProduk,
      kategoriProduk
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create product'
      );
    }

    return response.status(200).json({ namaProduk, totalProduk });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get list of product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProducts(request, response, next) {
  try {
    // mengambil data prodyct dari database
    let products = await warehouseService.getProducts();

    // request body
    const { page_number = 1, page_size = 5 } = request.query;

    const halamam = parseInt(page_number);
    const batasPerHalaman = parseInt(page_size);

    // variable untuk mengetahui jumlah produk yang dimiliki dari database
    const jumlahBarang = products.length;

    // mengetahui banyak halaman yang dimiliki
    const totalHalaman = Math.ceil(jumlahBarang / batasPerHalaman);

    // throw error jika halaman yang diinput lebih dari total halaman
    if (halamam < 1 || halamam > totalHalaman) {
      return response.status(404).json({
        message: `lebih dari total halaman yang tersedia, total halaman adalah ${totalHalaman}`,
      });
    }

    // variable index awal dari data produk
    const awal = (halamam - 1) * batasPerHalaman;
    // variable index akhir dari data produk
    const akhir = Math.min(awal + batasPerHalaman, jumlahBarang);

    const listProduk = products.slice(awal, akhir);

    const count = listProduk.length;

    const halamanSebelumnya = halamam > 1;
    const halamanSelanjutnya = halamam < totalHalaman;

    return response.status(200).json({
      page_number: halamam,
      page_size: batasPerHalaman,
      count: count,
      total_pages: totalHalaman,
      has_previous_page: halamanSebelumnya,
      has_next_page: halamanSelanjutnya,
      data: listProduk,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProducts(request, response, next) {
  try {
    const id = request.params.id;

    const success = await warehouseService.deteleProduct(id);
    console.log(success);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete product'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProduct(request, response, next) {
  try {
    const id = request.params.id;
    const namaBarang = request.body.namaBarang;
    const jumlah = request.body.jumlah;
    const kategori = request.body.kategori;

    const success = warehouseService.updateProduct(
      id,
      namaBarang,
      jumlah,
      kategori
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createProduct,
  getProducts,
  deleteProducts,
  updateProduct,
};

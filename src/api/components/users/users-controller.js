const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    // mengambil data user dari database
    let users = await usersService.getUsers();

    // mengambil parameter halaman ke berapa dan berapa banyak data yang ingin ditampilkan di setiap halaman
    // variabel page_number dan page_size juga memiliki nilai default (page_number = 1, page_size = 5) dengan menampilkan halaman pertama dan batasan perhalaman 5 jika hanya memasukan link seperti ini (get) http://localhost:3000/api/users bukan seperti ini http://localhost:3000/api/users?page_number=1&page_size=3
    const {
      page_number = 1,
      page_size = 5,
      search = '',
      sort = '',
    } = request.query;

    // Filter berdasarkan kriteria pencarian jika diberikan
    if (search) {
      const [criteria, value] = search.split(':');
      if (criteria === 'email') {
        users = users.filter((user) => user.email.includes(value));
      }
    }

    // Mengurutkan hasil berdasarkan kriteria pengurutan jika diberikan
    if (sort) {
      const [sortBy, sortOrder] = sort.split(':');
      users.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[sortBy].localeCompare(b[sortBy]);
        } else {
          return b[sortBy].localeCompare(a[sortBy]);
        }
      });
    }

    // // Filter berdasarkan email jika search mengandung 'email:'
    // let filteredUsers = users;
    // if (search.startsWith('email:')) {
    //   const searchValue = search.substring(6); // Menghapus 'email:' dari string pencarian
    //   filteredUsers = users.filter((user) => user.email.includes(searchValue));
    // }

    // // Mengurutkan hasil berdasarkan email
    // filteredUsers.sort((a, b) => {
    //   if (sort === 'desc') {
    //     return b.email.localeCompare(a.email); // Descending
    //   } else {
    //     return a.email.localeCompare(b.email); // Ascending (default)
    //   }
    // });

    // // membuat fungsi pencarian berdasarkan kata kunci
    // const cariUser = {
    //   email: (users, value) =>
    //     users.filter((user) => user.email.includes(value)),
    //   name: (users, value) => users.filter((user) => user.name.includes(value)),
    //   // Tambahkan fungsi pencarian baru di sini jika diperlukan
    // };

    // // Lakukan pencarian jika ada parameter pencarian
    // if (search) {
    //   const [kataKunci, nilai] = search.split(':');
    //   // Periksa apakah fungsi pencarian sesuai dengan kata kunci yang diberikan
    //   if (cariUser[kataKunci]) {
    //     filteredUsers = cariUser[kataKunci](users, nilai);
    //   }
    // }

    // // memetakan parameter pengurutan ke fungsi pengurutan yang sesuai
    // const mengurutkan = {
    //   asc: (a, b, sortBy) => a[sortBy].localeCompare(b[sortBy]),
    //   desc: (a, b, sortBy) => b[sortBy].localeCompare(a[sortBy]),
    // };

    // // Menerapkan pengurutan jika parameter pengurutan disediakan
    // if (sort) {
    //   const [sortBy, sortOrder] = sort.split(':');
    //   // Periksa apakah ada fungsi pengurutan yang sesuai dengan sortOrder yang diberikan
    //   if (mengurutkan[sortOrder]) {
    //     filteredUsers.sort((a, b) => mengurutkan[sortOrder](a, b, sortBy));
    //   }
    // }

    // mengubah tipe data page_number & page_size dari string menjadi integer
    const halaman = parseInt(page_number);
    const batasanPerHalaman = parseInt(page_size);

    const totalPengguna = users.length; // variable untuk mengetahui berapa banyak user yang ada di database
    const totalHalaman = Math.ceil(totalPengguna / batasanPerHalaman);

    // throw error jika halaman yang di input melebihi return dari total halaman
    if (halaman < 1 || halaman > totalHalaman) {
      return response.status(404).json({
        message: `Anda melebihi jumlah halaman yang tersedia, jumlah halaman yang tesedia adalah ${totalHalaman}`,
      });
    }

    const awal = (halaman - 1) * batasanPerHalaman; // mendapatkah index pertama dari data pengguna
    const akhir = Math.min(awal + batasanPerHalaman, totalPengguna); // mendapatkan index terakhir dari data pengguna dan memastikan bahwa indeks akhir tidak melebihi jumlah pengguna yang ada di database

    // mengambil data user berdasarkan halaman dan batasan user perhalaman yang di input
    const listUser = users.slice(awal, akhir);

    // menghitung jumlah user yang akan ditampilkan
    const count = listUser.length;

    const halamanSebelumnya = halaman > 1; // variabel ini digunaknan untuk mengecek apakah ada halaman sebelumnya atau tidak
    const halamanSelanjutnya = halaman < totalHalaman; //variabel ini digunaknan untuk mengecek apakah ada halaman selanjutnya atau tidak

    return response.status(200).json({
      page_number: halaman,
      page_size: batasanPerHalaman,
      count: count,
      total_pages: totalHalaman,
      has_previous_page: halamanSebelumnya,
      has_next_page: halamanSelanjutnya,
      data: listUser,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;

    // Check confirmation password
    if (password !== password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Email must be unique
    const emailIsRegistered = await usersService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await usersService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
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
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    // Email must be unique
    const emailIsRegistered = await usersService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await usersService.updateUser(id, name, email);
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

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change user password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changePassword(request, response, next) {
  try {
    // Check password confirmation
    if (request.body.password_new !== request.body.password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Check old password
    if (
      !(await usersService.checkPassword(
        request.params.id,
        request.body.password_old
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong password');
    }

    const changeSuccess = await usersService.changePassword(
      request.params.id,
      request.body.password_new
    );

    if (!changeSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change password'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};

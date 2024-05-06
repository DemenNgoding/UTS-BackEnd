const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_DURATION_MINUTES = 30;
const loginAttempts = {}; // Memantau jumlah percobaan login untuk setiap email

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check if the email has exceeded maximum login attempts
    if (loginAttempts[email] >= MAX_LOGIN_ATTEMPTS) {
      const blockDuration = BLOCK_DURATION_MINUTES * 60 * 1000; // Menit ke milidetik
      const timeRemaining =
        blockDuration - (Date.now() - loginAttempts[email + '_time']);

      if (timeRemaining > 0) {
        return response.status(403).json({
          message: `Anda terblokir, coba lagi dalam ${Math.ceil(timeRemaining / 60000)} menit`,
        });
      } else {
        // Reset login attempts if the block duration has passed
        delete loginAttempts[email];
        delete loginAttempts[email + '_time'];
      }
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (loginSuccess === 'gagal login') {
      // Increment login attempts
      loginAttempts[email] = (loginAttempts[email] || 0) + 1;
      loginAttempts[email + '_time'] = Date.now();

      if (loginAttempts[email] >= MAX_LOGIN_ATTEMPTS) {
        const blockDuration = BLOCK_DURATION_MINUTES * 60 * 1000; // Menit ke milidetik
        const timeRemaining =
          blockDuration - (Date.now() - loginAttempts[email + '_time']);
        return response.status(403).json({
          message: `Anda terblokir, coba lagi dalam ${Math.ceil(timeRemaining / 60000)} menit`,
        });
      }

      return response
        .status(403)
        .json({ message: 'anda terblokir coba lagi 30 menit kedepan' });
    }

    if (!loginSuccess) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    // Reset login attempts on successful login
    delete loginAttempts[email];
    delete loginAttempts[email + '_time'];

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};

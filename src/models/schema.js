const usersSchema = {
  name: String,
  email: String,
  password: String,
};

const warehouseSchema = {
  namaBarang: { type: String, required: true },
  jumlah: { type: Number, required: true },
  kategori: { type: String, required: true },
};

module.exports = {
  usersSchema,
  warehouseSchema,
};

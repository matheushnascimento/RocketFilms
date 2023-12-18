const AppError = require("../utils/AppError");
const { hash } = require("bcryptjs");
const knex = require("../database/knex");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;
    const hashedPassword = await hash(password, 8);

    if (!name) {
      throw new AppError("Nome é obrigatório");
    }

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
    });

    response.json();
  }
}

module.exports = UsersController;

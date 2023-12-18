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

  async update(request, response) {
    const { name, email, old_password, password } = request.body;
    const { id } = request.params;
    const userExists =
      (await knex.select("id").from("users").where("id", id)).length > 0
        ? true
        : false;

    if (!userExists) {
      throw new AppError("Usuário não encontrado");
    }

    const emailExists =
      (await knex.select("email").from("users").where("email", email)).length >
      0
        ? true
        : false;

    if (emailExists) {
      throw new AppError("Esse e-mail já está em uso");
    }

    await knex("users").where("id", id).update({
      name,
      email,
    });

    response.json();
  }
}

module.exports = UsersController;

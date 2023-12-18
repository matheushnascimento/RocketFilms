const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");
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
    let { name, email, old_password, password } = request.body;
    const { id } = request.params;
    const userExists =
      (await knex.select("id").from("users").where("id", id)).length > 0
        ? true
        : false;
    const user = await knex.select("*").from("users").where("id", id);

    if (!userExists) {
      throw new AppError("Usuário não encontrado");
    }

    if (!old_password && password) {
      throw new AppError("Informe a sua senha antiga");
    } else if (old_password && !password) {
      throw new AppError("Informe a nova senha");
    }

    if (old_password && password) {
      const checkOldPassword = await compare(old_password, user[0].password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere");
      } else {
        password = await hash(password, 8);
      }
    }

    if (!email) email = user[0].email;
    if (!name) name = user[0].name;
    if (!password) password = user[0].password;

    await knex("users").where("id", id).update({
      name,
      email,
    });

    response.json();
  }
}

module.exports = UsersController;

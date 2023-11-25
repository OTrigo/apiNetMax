const fs = require("fs");
const path = require("path");

const usersFilePath = path.join(__dirname, "../data/users.json");

function getAllUsers(req, res) {
  try {
    const data = fs.readFileSync(usersFilePath, "utf8");
    const users = JSON.parse(data).users;
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter usuários" });
  }
}

function getUserById(req, res) {
  try {
    const { id } = req.params;
    const data = fs.readFileSync(usersFilePath, "utf8");
    const users = JSON.parse(data).users;
    const user = users.find((user) => user.id === id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuário" });
  }
}

function createUser(req, res) {
  try {
    const { nome, cpf, senha, dataNascimento } = req.body;
    const data = fs.readFileSync(usersFilePath, "utf8");
    const users = JSON.parse(data).users;
    const newUser = {
      id: Date.now().toString(),
      nome: nome,
      cpf: cpf,
      senha: senha,
      dataNascimento: dataNascimento,
    };
    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify({ users }, null, 2), "utf8");
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
}

function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { nome, cpf, senha, dataNascimento } = req.body;
    const data = fs.readFileSync(usersFilePath, "utf8");
    let { users } = JSON.parse(data);
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      users[index] = {
        ...users[index],
        nome: nome,
        cpf: cpf,
        senha: senha,
        dataNascimento: dataNascimento,
      };
      fs.writeFileSync(
        usersFilePath,
        JSON.stringify({ users }, null, 2),
        "utf8"
      );
      res.json(users[index]);
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
}

function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const data = fs.readFileSync(usersFilePath, "utf8");
    let { users } = JSON.parse(data);
    const updatedUsers = users.filter((user) => user.id !== id);
    if (updatedUsers.length !== users.length) {
      fs.writeFileSync(
        usersFilePath,
        JSON.stringify({ users: updatedUsers }, null, 2),
        "utf8"
      );
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir usuário" });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

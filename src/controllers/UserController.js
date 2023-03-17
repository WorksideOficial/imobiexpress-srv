import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
const prisma = new PrismaClient();

export default {
  async createUser(request, response) {

    const { name, email, password } = request.body;

    try {
      let user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        return response.json({ 
          error: true,
          message: "Erro: Usuário já existe!" 
        });
      }

      const HashPassword = await hash(password, 8);

      user = await prisma.user.create({
        data: {
          name,
          email,
          password: HashPassword
        }
      });

      return response.json({
        error: false,
        message: "Sucesso: Usuário cadastrado com sucesso!",
        user
      });

    } catch (error) {
      return response.json({ message: error.message })
    }
  },

  async findAllUser(request, response) {
    try {
      const user = await prisma.user.findMany();

      return response.json(user);

    } catch (error) {
      return response.json({ message: error.message })
    }
  },

  async findUser(request, response) {
    try {
      const { userId } = request.params;

      const user = await prisma.user.findUnique({
        where: { id : Number(userId) }
      });
      delete user.password;
      return response.json(user);

    } catch (error) {
      return response.json({ message: error.message })
    }
  }
}
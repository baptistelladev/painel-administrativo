import { Request, Response } from 'express'; // Assegure-se de importar os tipos do express
import { createNewAdminService } from '../services/adminService';
import { IRequestNewAdmin } from '../models/IRequestCreateNewAdmin';

export const createNewAdminController = async (req: Request<{}, {}, IRequestNewAdmin>, res: Response): Promise<Response> => {
  try {
    const { email, password, claims, adminInfo } = req.body;

    console.log(adminInfo);


    // Validação de dados de entrada
    if (!email || !password) {
      return res.status(400).send({ error: "Você esqueceu o email ou a senha." });
    }

    if (typeof claims !== "object") {
      return res.status(400).send({ error: "Claim inválido." });
    }

    // Chamando o serviço que vai criar o usuário
    const result = await createNewAdminService(email, password, claims, adminInfo);

    // Resposta após a criação do usuário
    return res.status(201).send({
      message: "Usuário criado com sucesso",
      uid: result.uid,
      claims: result.claims,
      name: adminInfo.firstName
    });
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);

    // Respostas específicas para diferentes tipos de erro
    if (error.code === "auth/email-already-exists") {
      return res.status(409).send({ error: "O email já está em uso." });
    } else if (error.code === "auth/invalid-password") {
      return res.status(400).send({ error: "A senha fornecida é inválida." });
    } else if (error.code === "auth/invalid-email") {
      return res.status(400).send({ error: "O email fornecido é inválido." });
    } else {
      return res.status(500).send({ error: "Erro interno ao criar o usuário." });
    }
  }
};

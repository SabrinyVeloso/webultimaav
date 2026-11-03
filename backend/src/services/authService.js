import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { HttpError } from '../utils/httpError.js';

const publicUser = (user) => ({ id: user.id, nome: user.nome, email: user.email });

export async function register({ nome, email, senha }) {
  if (!nome?.trim() || !email?.trim() || !senha || senha.length < 6) {
    throw new HttpError(400, 'Nome, e-mail e senha com pelo menos 6 caracteres são obrigatórios.');
  }
  const normalizedEmail = email.trim().toLowerCase();
  const exists = await prisma.usuario.findUnique({ where: { email: normalizedEmail } });
  if (exists) throw new HttpError(409, 'Este e-mail já está cadastrado.');
  const senhaHash = await bcrypt.hash(senha, 12);
  const user = await prisma.usuario.create({ data: { nome: nome.trim(), email: normalizedEmail, senha: senhaHash } });
  return publicUser(user);
}

export async function login({ email, senha }) {
  const user = await prisma.usuario.findUnique({ where: { email: email?.trim().toLowerCase() } });
  if (!user || !(await bcrypt.compare(senha || '', user.senha))) throw new HttpError(401, 'E-mail ou senha inválidos.');
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { subject: String(user.id), expiresIn: '8h' });
  return { token, user: publicUser(user) };
}

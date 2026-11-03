import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/httpError.js';

export function auth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(new HttpError(401, 'Token não informado.'));
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    req.user = { id: Number(payload.sub), email: payload.email };
    return next();
  } catch {
    return next(new HttpError(401, 'Token inválido ou expirado.'));
  }
}

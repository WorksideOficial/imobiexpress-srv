import jwt from "jsonwebtoken";

export default function auth(request, response, next) {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.json({ message: "Não autorizado" }, 401)
  }

  const token = authorization.replace('Bearer', '').trim();
  try {
    const data = jwt.verify(token, '698dc19d489c4e4db73e28a713eab07b');
    const { id } = data;
    request.userId = id;
    return next();
  } catch {
    return response.json({ message: "Não autorizado" }, 401)
  }
}
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  console.log("req.cookies",req.cookies.jwt)
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, "development");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
export default auth;

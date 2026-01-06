import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access denied. Student role required.' });
  }
  next();
};

export const isHOD = (req, res, next) => {
  if (req.user.role !== 'hod') {
    return res.status(403).json({ message: 'Access denied. HOD role required.' });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

export const isHODOrAdmin = (req, res, next) => {
  if (req.user.role !== 'hod' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. HOD or Admin role required.' });
  }
  next();
};

export const isPrincipal = (req, res, next) => {
  if (req.user.role !== 'principal') {
    return res.status(403).json({ message: 'Access denied. Principal role required.' });
  }
  next();
};

export const isVicePrincipal = (req, res, next) => {
  if (req.user.role !== 'vice_principal') {
    return res.status(403).json({ message: 'Access denied. Vice Principal role required.' });
  }
  next();
};

export const isPrincipalOrVicePrincipal = (req, res, next) => {
  if (req.user.role !== 'principal' && req.user.role !== 'vice_principal') {
    return res.status(403).json({ message: 'Access denied. Principal or Vice Principal role required.' });
  }
  next();
};

export const isAdminOrPrincipalOrVP = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'principal' && req.user.role !== 'vice_principal') {
    return res.status(403).json({ message: 'Access denied. Admin, Principal, or Vice Principal role required.' });
  }
  next();
};

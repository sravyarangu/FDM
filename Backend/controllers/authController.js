import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/student.js';
import HOD from '../models/hod.js';
import Admin from '../models/admin.js';
import Principal from '../models/principal.js';
import VicePrincipal from '../models/vicePrincipal.js';

// Generate JWT Token
const generateToken = (user, role) => {
  return jwt.sign(
    { id: user._id, role: role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Student Login - Using Roll Number and DOB
export const studentLogin = async (req, res) => {
  try {
    const { rollNo, dob } = req.body;

    if (!rollNo || !dob) {
      return res.status(400).json({ message: 'Please provide roll number and date of birth' });
    }

    // Find student by roll number
    const student = await Student.findOne({ rollNo: rollNo.toUpperCase(), isActive: true });

    if (!student) {
      console.log(`Student not found with roll number: ${rollNo.toUpperCase()}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Normalize DOB for comparison - accept multiple formats
    const normalizeDOB = (dateStr) => {
      if (!dateStr) return '';
      
      // Already in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }
      
      // Handle DD-MM-YYYY or DD/MM/YYYY format
      const parts = dateStr.split(/[-\/]/);
      if (parts.length === 3) {
        const [part1, part2, part3] = parts;
        // If first part is 4 digits, it's YYYY-MM-DD
        if (part1.length === 4) {
          return `${part1}-${part2.padStart(2, '0')}-${part3.padStart(2, '0')}`;
        }
        // Otherwise assume DD-MM-YYYY and convert to YYYY-MM-DD
        return `${part3}-${part2.padStart(2, '0')}-${part1.padStart(2, '0')}`;
      }
      
      return dateStr;
    };

    const normalizedInputDob = normalizeDOB(dob);
    const normalizedStudentDob = normalizeDOB(student.dob);

    console.log(`Login attempt - Roll: ${rollNo.toUpperCase()}, Input DOB: ${dob} -> ${normalizedInputDob}, Stored DOB: ${student.dob} -> ${normalizedStudentDob}`);

    // Check DOB with normalized comparison
    if (normalizedStudentDob !== normalizedInputDob) {
      console.log(`DOB mismatch for ${rollNo.toUpperCase()}: expected ${normalizedStudentDob}, got ${normalizedInputDob}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(student, 'student');

    res.json({
      success: true,
      token,
      user: {
        id: student._id,
        rollNo: student.rollNo,
        name: student.name,
        email: student.email,
        branch: student.branch,
        program: student.program,
        admittedYear: student.admittedYear,
        year: student.currentYear,
        semester: student.semester,
        role: 'student'
      }
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// HOD Login - Using email and password
export const hodLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const hod = await HOD.findOne({ email, isActive: true });

    if (!hod) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password (hashed)
    const isMatch = await bcrypt.compare(password, hod.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(hod, 'hod');

    res.json({
      success: true,
      token,
      user: {
        id: hod._id,
        username: hod.username,
        name: hod.name,
        email: hod.email,
        branch: hod.branch,
        program: hod.program,
        role: 'hod'
      }
    });
  } catch (error) {
    console.error('HOD login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Admin Login - Using email and password
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email, isActive: true });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password (hashed)
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin, 'admin');

    res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Verify Token
export const verifyToken = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ valid: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
};

// ============ CHANGE PASSWORD ============

// Student Change Password
export const studentChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const student = await Student.findById(req.user.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Student uses DOB as password, verify current DOB
    if (student.dob !== currentPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update DOB with new password (in real scenario, you might want a separate password field)
    student.dob = newPassword;
    await student.save();

    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Student change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// HOD Change Password
export const hodChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const hod = await HOD.findById(req.user.id);
    
    if (!hod) {
      return res.status(404).json({ message: 'HOD not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, hod.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    hod.password = hashedPassword;
    await hod.save();

    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('HOD change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Change Password
export const adminChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const admin = await Admin.findById(req.user.id);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Admin change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ FORGOT/RESET PASSWORD ============

// Student Forgot Password - Reset using Roll No and DOB
export const studentForgotPassword = async (req, res) => {
  try {
    const { rollNo, dob, newPassword } = req.body;

    if (!rollNo || !dob || !newPassword) {
      return res.status(400).json({ 
        message: 'Please provide roll number, date of birth, and new password' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const student = await Student.findOne({ 
      rollNo: rollNo.toUpperCase(), 
      isActive: true 
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify DOB for identity confirmation
    if (student.dob !== dob) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update password (DOB field for students)
    student.dob = newPassword;
    await student.save();

    res.json({ 
      success: true, 
      message: 'Password reset successfully' 
    });
  } catch (error) {
    console.error('Student forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// HOD Forgot Password - Reset using username only
export const hodForgotPassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
      return res.status(400).json({ 
        message: 'Please provide username and new password' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const hod = await HOD.findOne({ 
      username, 
      isActive: true 
    });

    if (!hod) {
      return res.status(404).json({ message: 'HOD not found' });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    hod.password = hashedPassword;
    await hod.save();

    res.json({ 
      success: true, 
      message: 'Password reset successfully',
      email: hod.email // Return email for confirmation
    });
  } catch (error) {
    console.error('HOD forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Forgot Password - Reset using username only
export const adminForgotPassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
      return res.status(400).json({ 
        message: 'Please provide username and new password' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const admin = await Admin.findOne({ 
      username, 
      isActive: true 
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ 
      success: true, 
      message: 'Password reset successfully',
      email: admin.email // Return email for confirmation
    });
  } catch (error) {
    console.error('Admin forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ PRINCIPAL LOGIN & PASSWORD MANAGEMENT ============

// Principal Login
export const principalLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const principal = await Principal.findOne({ email, isActive: true });

    if (!principal) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password (hashed)
    const isMatch = await bcrypt.compare(password, principal.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(principal, 'principal');

    res.json({
      success: true,
      token,
      user: {
        id: principal._id,
        username: principal.username,
        name: principal.name,
        email: principal.email,
        role: 'principal'
      }
    });
  } catch (error) {
    console.error('Principal login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Principal Change Password
export const principalChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const principal = await Principal.findById(req.user.id);
    
    if (!principal) {
      return res.status(404).json({ message: 'Principal not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, principal.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    principal.password = hashedPassword;
    await principal.save();

    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Principal change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Principal Forgot Password - Reset using username only
export const principalForgotPassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
      return res.status(400).json({ 
        message: 'Please provide username and new password' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const principal = await Principal.findOne({ 
      username, 
      isActive: true 
    });

    if (!principal) {
      return res.status(404).json({ message: 'Principal not found' });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    principal.password = hashedPassword;
    await principal.save();

    res.json({ 
      success: true, 
      message: 'Password reset successfully',
      email: principal.email // Return email for confirmation
    });
  } catch (error) {
    console.error('Principal forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ VICE PRINCIPAL LOGIN & PASSWORD MANAGEMENT ============

// Vice Principal Login
export const vicePrincipalLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const vicePrincipal = await VicePrincipal.findOne({ email, isActive: true });

    if (!vicePrincipal) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password (hashed)
    const isMatch = await bcrypt.compare(password, vicePrincipal.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(vicePrincipal, 'vice_principal');

    res.json({
      success: true,
      token,
      user: {
        id: vicePrincipal._id,
        username: vicePrincipal.username,
        name: vicePrincipal.name,
        email: vicePrincipal.email,
        role: 'vice_principal'
      }
    });
  } catch (error) {
    console.error('Vice Principal login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Vice Principal Change Password
export const vicePrincipalChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const vicePrincipal = await VicePrincipal.findById(req.user.id);
    
    if (!vicePrincipal) {
      return res.status(404).json({ message: 'Vice Principal not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, vicePrincipal.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    vicePrincipal.password = hashedPassword;
    await vicePrincipal.save();

    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Vice Principal change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Vice Principal Forgot Password - Reset using username only
export const vicePrincipalForgotPassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
      return res.status(400).json({ 
        message: 'Please provide username and new password' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const vicePrincipal = await VicePrincipal.findOne({ 
      username, 
      isActive: true 
    });

    if (!vicePrincipal) {
      return res.status(404).json({ message: 'Vice Principal not found' });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    vicePrincipal.password = hashedPassword;
    await vicePrincipal.save();

    res.json({ 
      success: true, 
      message: 'Password reset successfully',
      email: vicePrincipal.email // Return email for confirmation
    });
  } catch (error) {
    console.error('Vice Principal forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

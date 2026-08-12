import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function registerUser(
  fullName: string,
  email: string,
  password: string,
  role: "ADMIN" | "SALES" | "WAREHOUSE" | "ACCOUNTS"
) {
  const [existingUsers] = await pool.execute(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if ((existingUsers as any[]).length > 0) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.execute(
    `INSERT INTO users (full_name, email, password, role)
     VALUES (?, ?, ?, ?)`,
    [fullName, email, hashedPassword, role]
  );

  return {
    id: (result as any).insertId,
    fullName,
    email,
    role
  };
}

export async function loginUser(email: string, password: string) {
  const [rows] = await pool.execute(
    `SELECT id, full_name, email, password, role
     FROM users
     WHERE email = ?`,
    [email]
  );

  const users = rows as any[];

  if (users.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = users[0];

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );

  return {
    token,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role
    }
  };
}
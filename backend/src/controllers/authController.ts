import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService";

export async function register(req: Request, res: Response) {
  try {
    const { fullName, email, password, role } = req.body;

    const user = await registerUser(
      fullName,
      email,
      password,
      role
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user
    });
  } catch (error: any) {
    if (error.message === "User with this email already exists") {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to register user"
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error: any) {
    if (error.message === "Invalid email or password") {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
}
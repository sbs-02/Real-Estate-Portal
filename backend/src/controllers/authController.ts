import type { Request, Response } from "express";
import User, { type IUser } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/*
  Functions to generate tokens
*/
const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: "15m" },
  );
};

const generateRefreshToken = (user: IUser) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};

/*
    Register a user
*/
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    //Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    //Store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User registered",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Registration Error" });
  }
};

/*
    Login a user
*/
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    //Store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login Successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login Error" });
  }
};

/*
    Refresh token
*/
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Refresh Token is required" });
    }

    const user = await User.findOne({ refreshToken: token });

    if (!user) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string,
      (err: jwt.VerifyErrors | null) => {
        if (err) {
          return res.status(403).json({ message: "Invalid Refresh Token" });
        }

        const accessToken = generateAccessToken(user);

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000,
        });

        res.json({ message: "Token Refreshed" });
      },
    );
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/*
    Logout
*/
export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(400).json({ message: "Refresh Token is required" });
    }

    const user = await User.findOne({ refreshToken: token });

    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Logout Error" });
  }
};


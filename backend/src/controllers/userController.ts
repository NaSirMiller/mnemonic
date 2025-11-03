import { Request, Response } from "express";
import { firebaseRepo } from "../repositories/firebaseRepository";
import { User } from "../models/user";

export async function createUser(request: Request, response: Response) {
  const userPayload = request.body as User;
  try {
    // Only allow the server to write the refresh token
    const createdUser = await firebaseRepo.createUser(userPayload);
    return response.status(200).json({
      message: "Successfully created user.",
      user: { userId: createdUser.userId },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
    console.error(err);
    return response.status(400).json({ message: errorMessage });
  }
}

export async function getUser(request: Request, response: Response) {
  const { userId } = request.params;
  try {
    const user = await firebaseRepo.getUser(userId);
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    // Never expose refreshToken in the response
    return response.status(200).json({ user: { userId: user.userId } });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
    console.error(err);
    return response.status(400).json({ message: errorMessage });
  }
}

export async function updateUser(request: Request, response: Response) {
  const { userId } = request.params;
  const updateData = request.body as Partial<User>;

  try {
    // Prevent clients from modifying refreshToken directly
    if ("refreshToken" in updateData) {
      return response.status(403).json({ message: "Unauthorized field: refreshToken" });
    }

    await firebaseRepo.updateUser(userId, updateData);
    return response.status(200).json({ message: "Successfully updated user." });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
    console.error(err);
    return response.status(400).json({ message: errorMessage });
  }
}

export async function deleteUser(request: Request, response: Response) {
  const { userId } = request.params;
  try {
    await firebaseRepo.deleteUser(userId);
    return response.status(200).json({ message: `Successfully deleted user ${userId}.` });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
    console.error(err);
    return response.status(400).json({ message: errorMessage });
  }
}

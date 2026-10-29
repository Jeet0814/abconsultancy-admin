import db from "../../db/connection";
import { comparePassword, hashPassword } from "../../utils/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken, JwtUserPayload } from "../../utils/tokens";

export class AuthService {
  static async login(email: string, plainPassword: string) {
    const user = await db("users")
      .where({ email: email.toLowerCase().trim() })
      .whereNull("deleted_at")
      .first();

    if (!user) {
      return null;
    }

    if (!user.is_active) {
      throw new Error("Account has been deactivated. Please contact the administrator.");
    }

    const isMatch = await comparePassword(plainPassword, user.password_hash);
    if (!isMatch) {
      return null;
    }

    const payload: JwtUserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ id: user.id, email: user.email });
    const refreshHash = await hashPassword(refreshToken);

    await db("users")
      .where({ id: user.id })
      .update({
        last_login_at: db.fn.now(),
        refresh_token_hash: refreshHash,
      });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return null;
    }

    const user = await db("users").where({ id: payload.id }).whereNull("deleted_at").first();
    if (!user || !user.is_active || !user.refresh_token_hash) {
      return null;
    }

    const isTokenMatch = await comparePassword(refreshToken, user.refresh_token_hash);
    if (!isTokenMatch) {
      return null;
    }

    const userPayload: JwtUserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const newAccessToken = signAccessToken(userPayload);
    const newRefreshToken = signRefreshToken({ id: user.id, email: user.email });
    const newRefreshHash = await hashPassword(newRefreshToken);

    await db("users").where({ id: user.id }).update({ refresh_token_hash: newRefreshHash });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: userPayload,
    };
  }

  static async logout(userId: number) {
    await db("users").where({ id: userId }).update({ refresh_token_hash: null });
  }

  static async changePassword(userId: number, currentPlain: string, newPlain: string) {
    const user = await db("users").where({ id: userId }).first();
    if (!user) {
      throw new Error("User not found.");
    }

    const isMatch = await comparePassword(currentPlain, user.password_hash);
    if (!isMatch) {
      throw new Error("Current password is incorrect.");
    }

    const newHash = await hashPassword(newPlain);
    await db("users").where({ id: userId }).update({
      password_hash: newHash,
      refresh_token_hash: null, // Invalidate existing sessions
    });
  }
}

import exp from "express";
import { authenticate } from "../services/AuthService.js";
import { verifyToken } from "../MiddleWares/verifyToken.js";
import { UserTypeModel } from "../Models/UserModel.js";
import { ArticleModel } from "../Models/ArticleModel.js";
import bcrypt from "bcryptjs";

export const commonRouter = exp.Router();


// ================= LOGIN =================

commonRouter.post("/login", async (req, res, next) => {
  try {
    let userCred = req.body;

    // authenticate user
    let { token, user } = await authenticate(userCred);

    // save token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/"
    });

    res.status(200).json({
      message: "Login success",
      payload: user,
    });

  } catch (err) {
    next(err);
  }
});


// ================= LOGOUT =================

commonRouter.get("/logout", (req, res) => {

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
});


// ================= CHANGE PASSWORD =================

commonRouter.put("/change-password", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res, next) => {

  try {

    let { currentPassword, newPassword, email } = req.body;

    let userInDb = await UserTypeModel.findOne({ email: email });

    if (!userInDb) {
      return res.status(400).json({ message: "User not found" });
    }

    let comparePassword = await bcrypt.compare(
      currentPassword,
      userInDb.password
    );

    if (!comparePassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    let hashedNewPassword = await bcrypt.hash(newPassword, 10);

    userInDb.password = hashedNewPassword;

    await userInDb.save();

    res.status(200).json({
      message: "Password changed",
    });

  } catch (err) {
    next(err);
  }
});

commonRouter.get("/check-auth", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res, next) => {
  try {
    const user = await UserTypeModel.findById(req.user.userId).select("-password")

    if (!user) {
      return res.status(401).json({ message: "User not found. Please login again." })
    }

    res.status(200).json({
      message: "authenticated",
      payload: user,
    })
  } catch (err) {
    next(err)
  }
})

commonRouter.get("/articles/:id", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res, next) => {
  try {
    const article = await ArticleModel.findById(req.params.id)
      .populate("author", "firstName lastName email")
      .populate("Comments.user", "firstName email")

    if (!article) {
      return res.status(404).json({ message: "Article not found" })
    }

    res.status(200).json({
      message: "Article found",
      payload: article,
    })
  } catch (err) {
    next(err)
  }
})
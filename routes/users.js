import express from "express";
import passport from "passport";
import {check, validationResult} from "express-validator";
import {calcHash, generateSalt} from "../util/auth.js";
import {PrismaClient} from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/* GET users listing. */
router.get("/", (req, res, next) => {

});

/**
 * ログイン画面(表示)
 */
router.get("/login", (req, res, next) => {
  const data = {
    title: "ログイン"
  };
  res.render("users/login", data);
});

/**
 * ログイン認証
 */
router.post("/login", passport.authenticate("local", {
  failWithError: true
}),(req, res, next) => {
  res.json({
    message: "OK"
  });
});

/**
 * ユーザ新規登録(表示)
 */
router.get("/signup", (req, res, next) => {
  const data = {
    title: "ユーザ新規登録",
    name: "",
    errors: []
  };
  res.render("users/signup", data);
});

/**
 * ユーザ新規登録処理
 */
router.post("/signup", [
  check("name", "名前の入力は必須です").notEmpty(),
  check("pass", "パスワードの入力は必須です").notEmpty(),
], async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    // 入力チェックでだめだった場合
    const errors = result.array();
    const data = {
      title: "ユーザ新規登録",
      name: req.body.name,
      errors,
    };
    res.render("users/signup", data);
    return;
  }
  // 入力チェックOKだったらこの先に進む。
  const {name, pass} = req.body;
  const salt = generateSalt();
  const hashedPassword = calcHash(pass, salt);
  await prisma.user.create({
    data: {
      name,
      pass: hashedPassword,
      salt
    }
  });
  res.redirect("/users/login");
});

export default router;
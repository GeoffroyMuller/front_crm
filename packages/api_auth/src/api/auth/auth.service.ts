import User from "../users/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Company from "../companies/company.model";
import * as fs from "fs";
import path from "path";

const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, "../../../private.key"), 'utf8')
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, "../../../public.key.pub"), 'utf8')

const JWT_EXPIRY_SECONDS = process.env.JWT_EXPIRY_SECONDS;

export default {
  async login(email: string, password: string) {
    const user = await User.query()
      .where("email", email)
      .withGraphFetched("company")
      .withGraphFetched("role")
      .first();
    if (user && (await bcrypt.compare(password, user.password || ""))) {
      const token = await jwt.sign(user.toJSON(), PRIVATE_KEY || "", {
        algorithm: "RS256",
        expiresIn: JWT_EXPIRY_SECONDS,
      });
      return { user, token };
    }
    throw "Invalid password or email";
  },
  async register(data: any) {
    const {email, password} = data;
    if (!email || !password) {
      throw "Email and password are required";
    }
    const user = await User.query().where("email", email).first();
    if (user) {
      throw "User already exists";
    }
    const company = await Company.query().insert({});
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.query().insert({
      ...data,
      idCompany: company.id,
      password: hashedPassword,
    });
    return newUser;
  }
}

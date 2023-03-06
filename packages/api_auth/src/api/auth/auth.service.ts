import User from "../users/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Company from "../companies/company.model";
import * as fs from "fs";
import path from "path";

const PRIVATE_KEY = fs.readFileSync(
  path.join(__dirname, "../../../private.key"),
  "utf8"
);
const PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, "../../../public.key.pub"),
  "utf8"
);

const JWT_EXPIRY_SECONDS = process.env.JWT_EXPIRY_SECONDS;

async function getTokenFromCode(code: string) {
  const user = await User.query()
    .where("accessTokenCode", code)
    .withGraphFetched("company")
    .withGraphFetched("role")
    .first();
  if (user) {
    await User.query().updateAndFetchById(user.id as string, { accessTokenCode: null });
    return await getToken(user);
  }
  throw "Invalid access code";
  
}

async function generateAccessTokenCode(user: User) {
  const accessTokenCode =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  await User.query().updateAndFetchById(user.id as string, { accessTokenCode });
  return accessTokenCode;
}

async function getToken(user: User) {
  return await jwt.sign(user.toJSON(), PRIVATE_KEY || "", {
    algorithm: "RS256",
    expiresIn: JWT_EXPIRY_SECONDS,
  });
}


export default {
  getToken,
  generateAccessTokenCode,
  getTokenFromCode,
  async login(props: {email?: string, password?: string, code?: string}) {
    const { email, password, code } = props;
    if (!email && !code) {
      throw "Email or access code is required";
    }
    const query = User.query();
    if (code) {
      query.where("accessTokenCode", code)
    } else {
      query.where("email", email as string)
    }
    const user = await query
      .withGraphFetched("company")
      .withGraphFetched("role")
      .first();
      
    if (user && (code || await bcrypt.compare(password as string, user.password || ""))) {
      if (code) {
        await User.query().updateAndFetchById(user.id as string, { accessTokenCode: null });
      }
      const token = await getToken(user);
      return { user, token };
    }
    throw "Invalid password or email";
  },
  async register(data: any) {
    const { email, password } = data;
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
  },
};

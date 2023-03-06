import User from "../users/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Company from "../companies/company.model";
import * as fs from "fs";
import path from "path";
import { uniqueId } from "lodash";

const PRIVATE_KEY = fs.readFileSync(
  path.join(__dirname, "../../../private.key"),
  "utf8"
);
const PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, "../../../public.key.pub"),
  "utf8"
);

const JWT_EXPIRY_SECONDS = process.env.JWT_EXPIRY_SECONDS;

async function generateRandomToken(): Promise<string> {
  return await jwt.sign({ randomToken: true }, Math.random().toString(), {
    algorithm: "HS256",
  });
}

async function getTokenFromCode(code: string) {
  const user = await User.query()
    .where("accessTokenCode", code)
    .withGraphFetched("company")
    .withGraphFetched("role")
    .first();
  if (user) {
    await User.query().updateAndFetchById(user.id as string, {
      accessTokenCode: null,
    });
    return await getToken(user);
  }
  throw "Invalid access code";
}

async function generateAccessTokenCode(user: User) {
  const accessTokenCode = await generateRandomToken();
  await User.query().updateAndFetchById(user.id as string, { accessTokenCode });
  return accessTokenCode;
}

async function getToken(user: User) {
  return await jwt.sign(user.toJSON(), PRIVATE_KEY || "", {
    algorithm: "RS256",
    expiresIn: JWT_EXPIRY_SECONDS,
  });
}

type LoginProps =
  | {
      email: string;
      password: string;
    }
  | { code: string }
  | {
      refreshToken: string;
    };

export default {
  getToken,
  generateAccessTokenCode,
  getTokenFromCode,
  async login(props: LoginProps) {
    // @ts-ignore
    let { email, password, code, refreshToken } = props;
    const query = User.query();
    if (code) {
      query.where("accessTokenCode", code);
    } else if (refreshToken) {
      query.where("refreshToken", refreshToken);
    } else {
      query.where("email", email as string);
    }
    const user = await query
      .withGraphFetched("company")
      .withGraphFetched("role")
      .first();

    if (
      !user ||
      (!code && !refreshToken &&
        !(await bcrypt.compare(password as string, user.password || "")))
    ) {
      throw "Invalid password or email";
    }
    refreshToken = await generateRandomToken();
    await User.query().updateAndFetchById(user.id as string, {
      refreshToken,
      accessTokenCode: null,
    });
    const token = await getToken(user);
    return { user, token, refreshToken };
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

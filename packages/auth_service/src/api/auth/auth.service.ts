import User from "../users/user.model";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import Company from "../companies/company.model";

const JWT_KEY = process.env.JWT_KEY;
const JWT_EXPIRY_SECONDS = process.env.JWT_EXPIRY_SECONDS;

export default  {
  async login(email: string, password: string) {
    const user = await User.query()
      .where("email", email)
      .withGraphFetched("company.clientCompanies")
      .withGraphFetched("role")
      .first();

    if (user && (await bcrypt.compare(password, user.password || ""))) {
      const token = await jwt.sign({ id: user.id }, JWT_KEY || "", {
        algorithm: "HS256",
        expiresIn: JWT_EXPIRY_SECONDS,
      });
      return { user, token };
    }
    throw "Invalid password or email";
  },
  async verify(token: string): Promise<User | undefined> {
    if (!token) return undefined;

    interface JwtPayload {
      id: string;
    }
    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, JWT_KEY || "") as JwtPayload;
      const { id } = payload;
      const auth = await User.query()
        .where("id", "=", id)
        .withGraphFetched("company.clientCompanies")
        .withGraphFetched("role")
        .first();
      return auth || undefined;
    } catch (e) {
      return undefined;
    }
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

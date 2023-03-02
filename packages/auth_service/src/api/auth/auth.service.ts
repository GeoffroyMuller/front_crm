import User from "../users/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Company from "../companies/company.model";



const PRIVATE_KEY = '-----BEGIN RSA PRIVATE KEY-----\n' +
'MIIEpAIBAAKCAQEAhsQqeMlUI+SYWF88ERBSQT+h/Xj3Tmjc5mdR8n+ww83/MNMt\n' +
'XUbCJ3BHkwx9/DDpKmhjLz9cfmoc6xjckhbG3No79rHI4uoMgCObJi/rKS5Kp/+k\n' +
'AdRZkgm/VvW+63e8ZsrH4r3doj5APe0+ThP3BrI1kz09RKTdXWFigGcwVLYDqtFI\n' +
'4O2wZJyp4zGyV+wMBebPqeL+XNA/TnyiF13yOgG4ZUBePH1feppi+3vVm5RwaxmE\n' +
'kxxeNCZwdroZ98HPLrcKbo7A9yxRdMoVMRTM3R8y326zIFIvifXo7CIIPS5WQkp4\n' +
'Sw3fWsF/vwi1PUFPv4oOBeSv0SuOrwMu/ebx+QIDAQABAoIBAH24bq6zkqzRSlXW\n' +
'siBxC2sXQ7VEreEV7k16wXXqLSrc913DA6Tqp6FHG15Q3w7vSfVn4G9pOo4ry8J+\n' +
'NPaMDQRnCl1/SRp2oSbBELG1LjoCl17WG1ghk1WrhjZHls3vq3BxZ7tcyG/chu2+\n' +
'bstD0MUMZvJuxMNO0buVZ+DFYs8Cey3QktGDXU72YUi8Oa1jrA+kZQYEZ7Ke0+py\n' +
'vmcz8L/zCsARsqyuP4Lzn6fhZm6N/bj7gGDqDKVJkMdkAeZ5LheCVhANkJ3AzEDk\n' +
'NAX8AnfsrhAkVaKtLzol1xomS71DsprUnN1PVcfyzUa0Eok8C+C0OEK+wJXT24Uy\n' +
'rkKG5ikCgYEA+1jbxwpl+m4gIqxJxtAySfvhiPYSjuhf247PygCHC5Vlcn2AP44W\n' +
'QQXAbqJ3CMSUdYV0km6zS9PdlsH9TtbeM1RoryDzyROv14zLNXJ0aLrLS6dBXUe0\n' +
'0eiMhkSfBp4XZ411uXeDhBAX2MS/kvrx2JsVEUy1YD8iVWARC4ENJv8CgYEAiULT\n' +
'zBPbFXbX+gYvZyxA8yRF0vLI0NZrHq3NHagI+OZeLFmbtnnOnlrpKxxTCIzZsNIP\n' +
'Q0XKFXPL2BGoWI4SPndCVSm7BekOx1RrFd5D5rwSARwlX0Ni2FyPecjlH1YEHZFe\n' +
'ShgzvjSxpzSzVYFmxFgAaQBn2ZAf8lSBdCMuHwcCgYEA7TvMjMxqvnltCWz2YZmm\n' +
'rZ/5Gs2vbIU13MSpqS7gR/Wlf++mudYBeTPVklbz5SmuOlJRWdj0kDCTqLTGwsAZ\n' +
'j/cuq4V9tB9JzDhOoM67wxHzyh8+ma2RpMJKyHxCYPuceZfSMtD0KBUMfQQPEcqb\n' +
'tGeD9gUh+Ir+e/ilfec7o78CgYAflwS9pBg44Wglf8TrHtE35DI5sWysO5zdq6xY\n' +
'VfLyrbogxOLEZVY7NbsSE+u8PQZg3odquSYgN81DRhUThGcIf1QB25/SZWfkUjZv\n' +
'Cv9fnAscvEiRmyWlm+/dXHH2+0npMCqeLOHDtcbpL4TSefyX1ZUKlXBRLw1bLT25\n' +
'59rWgwKBgQCnfOcfMNtxOIsjjbgCgCkwEMoOTLNj8KZ8vJacpyuJQd3XaL9xQjbm\n' +
'2+fq2vx7sZKqJ+boNz5TcUPjqPMiwVfd398Ik8sku445TtzDG5F0v0DYBngZ/PcD\n' +
'U50gavuoJrCJn4FOPkVDY0Ij6Ar6iU3VC/+ju400HrP8+Zpzn4OORQ==\n' +
'-----END RSA PRIVATE KEY-----';
const PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\n' +
'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhsQqeMlUI+SYWF88ERBS\n' +
'QT+h/Xj3Tmjc5mdR8n+ww83/MNMtXUbCJ3BHkwx9/DDpKmhjLz9cfmoc6xjckhbG\n' +
'3No79rHI4uoMgCObJi/rKS5Kp/+kAdRZkgm/VvW+63e8ZsrH4r3doj5APe0+ThP3\n' +
'BrI1kz09RKTdXWFigGcwVLYDqtFI4O2wZJyp4zGyV+wMBebPqeL+XNA/TnyiF13y\n' +
'OgG4ZUBePH1feppi+3vVm5RwaxmEkxxeNCZwdroZ98HPLrcKbo7A9yxRdMoVMRTM\n' +
'3R8y326zIFIvifXo7CIIPS5WQkp4Sw3fWsF/vwi1PUFPv4oOBeSv0SuOrwMu/ebx\n' +
'+QIDAQAB\n' +
'-----END PUBLIC KEY-----';

const JWT_EXPIRY_SECONDS = process.env.JWT_EXPIRY_SECONDS;

export default {
  async login(email: string, password: string) {
    const user = await User.query()
      .where("email", email)
      .withGraphFetched("company.clientCompanies")
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

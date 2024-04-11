import type { ID } from "core/src/types";
import type { Role } from "./roles";

export interface User {
  id?: ID;
  firstname?: string;
  lastname?: string;
  email?: string;
  role?: Role;
}

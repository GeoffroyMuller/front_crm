import type { ID } from "./utils";

export interface Right {
  id: ID;
  name: string;
}

export interface Role {
  id: ID;
  name: string;
  rights?: Array<Right>;
}

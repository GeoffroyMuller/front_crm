import type { ID } from "./utils";

export interface Rights {
  id: ID;
  name: string;
}

export interface Role {
  id: ID;
  name: string;
  rights?: Array<Rights>;
}

import type { ID } from "./utils";

export interface Role {
  id: ID;
  name: string;
  rights: Array<string>;
}

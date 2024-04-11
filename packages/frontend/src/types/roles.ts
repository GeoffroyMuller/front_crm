import type { ID } from "core/src/types";

export interface Role {
  id: ID;
  name: string;
  rights: Array<string>;
}

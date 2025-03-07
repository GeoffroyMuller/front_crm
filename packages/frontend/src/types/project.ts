export type Project = {
  id: number;
  name: string;
  description: string;
  color: string;
};

export type Section = {
  id: number;
  name: string;
  idProject: number;
  project?: Project;
};

export type Task = {
  id: number;
  name: string;
  description: string;
  idProject: number;
  idSection: number;
  completed?: boolean;
};

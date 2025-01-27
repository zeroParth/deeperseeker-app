export enum Role {
  User = 0,
  Bot = 1,
}

export interface Message {
  role: Role;
  content: string;
  prefix?: boolean;
  reasoning_content?: string;
}

export interface Chat {
  id: number;
  title: string;
}

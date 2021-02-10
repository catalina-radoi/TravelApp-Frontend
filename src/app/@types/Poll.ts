import { User } from './User';

export class Poll {
  id: number;
  status: string;
  question: string;
  groupId: number;
  user: User;
  type: string;

  constructor() {
  }
}

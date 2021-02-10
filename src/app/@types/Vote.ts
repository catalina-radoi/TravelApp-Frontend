import { User } from './User';
import { Choice } from './Choice';

export class Vote {
  id: number;
  status: string;
  pollId: number;
  adminId: number;
  choiceId: number;
  user: User;
  choice: Choice;


  constructor() {
  }
}

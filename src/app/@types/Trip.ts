import { User } from './User';
import { Offer } from './Offer';
import { Group } from './Group';

export class Trip {
  tripId: number;
  groupName: string;
  groupTrip: Group;
  adminTrip: User;
  status: string;
  step: string;
  startDate: Date;
  endDate: Date;
  startInterval: Date;
  endInterval: Date;
  location: string;
  offerTrip: Offer;
  members: User[];



  constructor() {
  }
}

export interface Caller {
  id: string;
  name: string;
  imagePath: string;
}

export interface User {
  id: string;
  name: string;
  created: Date;
}

export interface Answer {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  comment: string;
  accepted: boolean;
  created: Date;
}

export interface Event {
  id: string;
  time: Date;
  callerId: string;
}

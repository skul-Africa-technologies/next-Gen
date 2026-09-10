export class Event {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  image: string | null;
  location: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

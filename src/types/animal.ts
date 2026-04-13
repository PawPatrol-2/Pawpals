export type Animal = {
  _id: string;
  createdAt?: string;
  type: string;
  breed: string;
  image: string;
  name: string;
  age: number;
  keyTraits: string;
  personality: string;
  description: string;
  organizationOwner?: string;
  likes: string[];
};

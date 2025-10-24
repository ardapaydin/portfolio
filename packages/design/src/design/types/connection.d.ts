export type TypeConnection = {
  id: string;
  service: "github";
  userId: string;
  serviceUser: {
    id: number;
    slug: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

type AnimalLike = {
  _id?: string;
  id?: string | number;
  createdAt?: string;
};

const getSortTime = (animal: AnimalLike) => {
  if (animal.createdAt) {
    const createdAtTime = new Date(animal.createdAt).getTime();
    if (!Number.isNaN(createdAtTime)) {
      return createdAtTime;
    }
  }

  const id = animal._id ?? animal.id;

  if (typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id)) {
    return parseInt(id.slice(0, 8), 16) * 1000;
  }

  return 0;
};

export const sortAnimalsNewestFirst = <T extends AnimalLike>(animals: T[]) =>
  [...animals].sort((left, right) => getSortTime(right) - getSortTime(left));

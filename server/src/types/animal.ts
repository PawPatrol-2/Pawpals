export type CreateAnimalInput = {
    type: string;
    breed: string;
    image: string;
    name: string;
    age: number;
    city: string;
    keyTraits?: string | undefined;
    personality?: string | undefined;
    description?: string | undefined;
    childFriendly?: boolean | undefined;
    organizationOwner?: string | undefined;
    likes?: string[] | undefined;
}

export type DeleteAnimalInput = {
    id: string;
};

export type UpdateAnimalInput = {
    id: string;
    type?: string;
    breed?: string;
    image?: string;
    name?: string;
    age?: number;
    city?: string;
    keyTraits?: string;
    personality?: string;
    description?: string;
    childFriendly?: boolean;
    organizationOwner?: string;
    likes?: string[];
};
import { Image } from "./room";

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
    image: Image;
    about: string;
}

import { Image } from "./room";
import { User } from "./user";

export type Review = {
    _id: string;
    hotelRoomslug: string;
    hotelRoom: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: User;
}
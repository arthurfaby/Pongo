import { IsUrl } from "class-validator";

export class UserDto {
    constructor(username: string, email: string, url: string) {
        this.username = username;
        this.email = email;
        this.avatar = url;
        this.status = 1;
        this.last_online_date = new Date();
        this.doubleAuth = false;
        this.code = 0;
        this.time = 0;
    }
    id: number;
    username: string;
    email: string;
    avatar: string;
    status: number;
    last_online_date: Date;
    doubleAuth: boolean;
    code: number;
    time: number;
}
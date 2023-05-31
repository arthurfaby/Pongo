export interface UserInterface {
    id: number;
    username: string;
    password: string;
    avatar: string;
    status: number;
    last_online_date: Date;
    doubleAuth: boolean;
    code: number;
    time: number;
}

export class MembersDto {
    member_id: number;
    channel_id: number;
    user_id: number;
    user_status: number;
    mute_status: boolean;
    mute_time: number;
    mute_timestamp_day: number;
    mute_timestamp_msec: number;
    ban_status: boolean;
}
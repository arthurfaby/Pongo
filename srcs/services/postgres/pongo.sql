\c pongo;

--DELETE FROM game_category;
-- DELETE FROM game_category_id_seq;
--DELETE FROM stat_category;
-- DELETE FROM stat_category_id_seq;
--DELETE FROM user_category;
-- DELETE FROM user_category_id_seq;
--DELETE FROM message_category;
-- DELETE FROM message_category_id_seq;
--DELETE FROM channel_category;
-- DELETE FROM channel_category_id_seq;
--DELETE FROM member_category;
-- DELETE FROM channel_category_id_seq;
--DELETE FROM blocked_users_category;
--DELETE FROM friend_users_category;
-- export class GamesDto {
--     id: number;
--     player1_id: number;
--     player2_id: number;
--     score_player1: number;
--     score_player2: number;
--     date: Date;
-- }
INSERT INTO game_category (player1_id, player2_id, score_player1, score_player2, date) VALUES (1, 2, 5, 0, '2023-05-04');
INSERT INTO game_category (player1_id, player2_id, score_player1, score_player2, date) VALUES (1, 3, 5, 3, '2023-05-04');
INSERT INTO game_category (player1_id, player2_id, score_player1, score_player2, date) VALUES (4, 2, 5, 0, '2023-05-04');
INSERT INTO game_category (player1_id, player2_id, score_player1, score_player2, date) VALUES (1, 2, 5, 2, '2023-05-04');
INSERT INTO game_category (player1_id, player2_id, score_player1, score_player2, date) VALUES (2, 4, 5, 0, '2023-05-04');
INSERT INTO game_category (player1_id, player2_id, score_player1, score_player2, date) VALUES (3, 2, 5, 3, '2023-05-04');
INSERT INTO game_category (player1_id, player2_id, score_player1, score_player2, date) VALUES (4, 1, 5, 4, '2023-05-04');
INSERT INTO game_category (player1_id, player2_id, score_player1, score_player2, date) VALUES (3, 2, 5, 0, '2023-05-04');
INSERT INTO game_category (player1_id, player2_id, score_player1, score_player2, date) VALUES (1, 3, 5, 2, '2023-05-04');
INSERT INTO game_category (player1_id, player2_id, score_player1, score_player2, date) VALUES (4, 2, 5, 0, '2023-05-04');
INSERT INTO game_category (player1_id, player2_id, score_player1, score_player2, date) VALUES (1, 2, 5, 1, '2023-05-04');

-- export class StatsDto {
--     id: number;
--     user_id: number;
--     wins: number;
--     losses: number;
--     level: number;
--     achievements: string;
--     number_of_games: number;
-- }
INSERT INTO stat_category (user_id, wins, losses, level, achievements, number_of_games) VALUES (1, 5, 1, 3, 'boss', 6);
INSERT INTO stat_category (user_id, wins, losses, level, achievements, number_of_games) VALUES (2, 1, 7, 4, 'null', 8);
INSERT INTO stat_category (user_id, wins, losses, level, achievements, number_of_games) VALUES (3, 2, 2, 2, 'ok tier', 4);
INSERT INTO stat_category (user_id, wins, losses, level, achievements, number_of_games) VALUES (4, 3, 1, 2, 'gg', 4);

-- export class UserDto {
--     id: number;
--     username: string;
--     password: string;
--     avatar: string;
--     blocked_user: number[];
--     friend_list: number[];
--     status: number;
--     history: number[];
--   }
INSERT INTO user_category (username, email, avatar, status) VALUES ('toto', 'totoi@pass.com', 'https://img.freepik.com/vecteurs-premium/profil-avatar-homme-icone-ronde_24640-14044.jpg?w=2000', 0);
INSERT INTO user_category (username, email, avatar, status) VALUES ('tata', 'tata@pass.com', 'https://img.freepik.com/vecteurs-premium/profil-avatar-homme-icone-ronde_24640-14044.jpg?w=2000', 2);
INSERT INTO user_category (username, email, avatar, status) VALUES ('titi', 'titi@pass.com', 'https://img.freepik.com/vecteurs-premium/profil-avatar-homme-icone-ronde_24640-14044.jpg?w=2000', 0);
INSERT INTO user_category (username, email, avatar, status) VALUES ('tutu', 'tutu@pass.com', 'https://img.freepik.com/vecteurs-premium/profil-avatar-homme-icone-ronde_24640-14044.jpg?w=2000', 1);

-- export class MessagesDto {
--     message_id: number;
--     content: string;
--     sender_id: number;
--     channel_id: number;
-- }
INSERT INTO message_category (content, sender_id, channel_id) VALUES ('coucou', 1, 1);
INSERT INTO message_category (content, sender_id, channel_id) VALUES ('yo', 2, 1);
INSERT INTO message_category (content, sender_id, channel_id) VALUES ('hey', 3, 2);
INSERT INTO message_category (content, sender_id, channel_id) VALUES ('hi', 4, 2);
INSERT INTO message_category (content, sender_id, channel_id) VALUES ('slt', 1, 2);
INSERT INTO message_category (content, sender_id, channel_id) VALUES ('salut', 2, 3);
INSERT INTO message_category (content, sender_id, channel_id) VALUES ('yop', 3, 3);
INSERT INTO message_category (content, sender_id, channel_id) VALUES ('mlauro le bonobo', 4, 4);

-- export class ChannelsDto {
--     channel_id: number;
--     mode: number;
--     password: string;
--     user_list: number[];
--     op_list: number[];
--     ban_list: number[];
--     mute_list: number[];
-- } 
INSERT INTO channel_category (name, mode, password) VALUES ('Channel1', 0, '');
INSERT INTO channel_category (name, mode, password) VALUES ('Channel2', 1, '');
INSERT INTO channel_category (name, mode, password) VALUES ('Channel3', 2, 'pass');
INSERT INTO channel_category (name, mode, password) VALUES ('Channel4', 0, '');

-- export class BlockedUsersDto {
--     id: number;
--     user1_id: number;
--     user2_id: number;
-- }

INSERT INTO blocked_users_category (user1_id, user2_id) VALUES (1, 2);
INSERT INTO blocked_users_category (user1_id, user2_id) VALUES (3, 4);

-- export class FriendUsersDto {
--     id: number;
--     user1_id: number;
--     user2_id: number;
--     pending: boolean;
-- }

INSERT INTO friend_users_category (user1_id, user2_id, pending) VALUES (1, 2, false);
INSERT INTO friend_users_category (user1_id, user2_id, pending) VALUES (2, 3, false);
INSERT INTO friend_users_category (user1_id, user2_id, pending) VALUES (4, 2, true);
INSERT INTO friend_users_category (user1_id, user2_id, pending) VALUES (4, 1, false);


-- export class MembersDto {
--     member_id: number;
--     channel_id: number;
--     user_id: number;
--     op_status: boolean;
--     mute_status: boolean;
--     ban_status: boolean;
-- }
INSERT INTO member_category (channel_id, user_id, user_status, mute_status, mute_time, mute_timestamp_day, mute_timestamp_msec, ban_status) VALUES (1, 1, 0, false, 0, 0, 0, false);
INSERT INTO member_category (channel_id, user_id, user_status, mute_status, mute_time, mute_timestamp_day, mute_timestamp_msec, ban_status) VALUES (1, 2, 1, true, 0, 0, 0, false);
INSERT INTO member_category (channel_id, user_id, user_status, mute_status, mute_time, mute_timestamp_day, mute_timestamp_msec, ban_status) VALUES (1, 3, 2, false, 0, 0, 0, true);
INSERT INTO member_category (channel_id, user_id, user_status, mute_status, mute_time, mute_timestamp_day, mute_timestamp_msec, ban_status) VALUES (2, 1, 0, false, 0, 0, 0, false);
INSERT INTO member_category (channel_id, user_id, user_status, mute_status, mute_time, mute_timestamp_day, mute_timestamp_msec, ban_status) VALUES (2, 3, 2, false, 0, 0, 0, false);
INSERT INTO member_category (channel_id, user_id, user_status, mute_status, mute_time, mute_timestamp_day, mute_timestamp_msec, ban_status) VALUES (2, 4, 2, false, 0, 0, 0, false);
INSERT INTO member_category (channel_id, user_id, user_status, mute_status, mute_time, mute_timestamp_day, mute_timestamp_msec, ban_status) VALUES (3, 2, 1, false, 0, 0, 0, false);
INSERT INTO member_category (channel_id, user_id, user_status, mute_status, mute_time, mute_timestamp_day, mute_timestamp_msec, ban_status) VALUES (3, 3, 1, false, 0, 0, 0, false);
INSERT INTO member_category (channel_id, user_id, user_status, mute_status, mute_time, mute_timestamp_day, mute_timestamp_msec, ban_status) VALUES (3, 4, 2, false, 0, 0, 0, false);
INSERT INTO member_category (channel_id, user_id, user_status, mute_status, mute_time, mute_timestamp_day, mute_timestamp_msec, ban_status) VALUES (4, 3, 1, false, 0, 0, 0, false);
INSERT INTO member_category (channel_id, user_id, user_status, mute_status, mute_time, mute_timestamp_day, mute_timestamp_msec, ban_status) VALUES (4, 4, 0, false, 0, 0, 0, false);

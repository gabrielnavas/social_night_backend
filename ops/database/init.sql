-- create schemas begin
create schema if not exists users;
create schema if not exists friends;
create schema if not exists posts;
-- createschemas end

-- create tables begin
-- users
create table if not exists users.user (
	id serial primary key,
	username varchar(255) unique not null,
	email varchar(255) unique not null,
	password varchar(255) not null,
	created_at timestamp not null default now(),
	updated_at timestamp not null default now()
);


-- friends
create table if not exists friends.send_request_friend(
	requester_id int references users.user(id),
	target_id int references users.user(id),
	primary key(requester_id, target_id),
	created_at timestamp not null default now()
);

create table if not exists friends.friend(
	user_id int references users.user(id),
	friend_id int references users.user(id),
	primary key(user_id, friend_id),
	sended_request_at timestamp not null,
	accepted_at timestamp not null default now()
);
-- create tables end



-- -- // * eu vou criar uma nova requisicao de friend
-- ---
-- insert into friends.send_request_friend (requester_id, user_id) -- requester_id é apessoa que mandou solicitação, user_id é meu id
-- values (7, 3) 
-- ---


-- -- // * selecionar todos minhas requisições de friend
-- ----
-- select u.id as user_id, username, email, u.created_at, updated_at 
-- from users.user as u
-- inner join friends.send_request_friend as rf on rf.requester_id = u.id
-- where(rf.user_id = 4) -- rf.user_id é meu id 
-- ----



-- -- // * deletar uma requisicao  de friend
-- --
-- delete from friends.send_request_friend as rf
-- where 
-- 	rf.requester_id = 3 and -- id da pessoa que eu quero cancelar
-- 	rf.user_id = 6; -- meu id
-- --


-- -- // * aceitar uma amizade
-- -----------
-- delete from friends.send_request_friend as rf
-- where 
-- 	rf.requester_id = 1 and -- rf.requester_id é id da pessoa que eu quero aceitar
-- 	rf.user_id = 3; --rf.user_id é meu id;
-- insert into friends.friend 
-- 	(user_id, friend_id, sended_request_at) -- sended_request_at da linha deletada do created_at do send_request_friend
-- values(3, 1, sended_request_at);
-- ----



-- -- // * selecionar todos meus amigos
-- -----
-- select u.id as user_id, username, email, u.created_at, updated_at, sended_request_at, accepted_at 
-- from  users.user as u
-- inner join friends.friend as f on f.friend_id = u.id
-- where f.user_id = 3;
-- -----



-- -- // * deletar um amigo meu, (id dele eu sei que ja existe)
-- -------
-- delete from friends.friend
-- where user_id = 3 and friend_id = 1;
-- -----
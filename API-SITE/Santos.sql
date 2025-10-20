use Santos;

select * from users;
insert into users(cpf, rg, chaveUnitaria, senhaHash, nome, telefone, email, createdAt, updatedAt) 
values (
    '14552233344',  -- cpf único
    'ps2i12345',    -- rg único
    98765,          -- chaveUnitaria única
    'ponto', 
    'Matheus rei deles', 
    '11987654321',  -- telefone único
    'teteusa@email.com', -- email único
    now(), 
    now()
);

select * from esp;
insert into esp(nome, `local` , createdAt, updatedAt) values ("primeiro", "santos", now(), now());
select * from scheduling;
INSERT INTO scheduling (`local`, empresa, 
carga, dataHora, finalizado, idUsuario, idEsp, createdAt, updatedAt) VALUES ("Porto de Santos", "Maersk Brasil", "Container 20ft - Eletrônicos", "2024-01-15 08:00:00", false, 1, 1, now(), now());
select * from `read`;
insert into `read`(readKey, idEsp, crateAt) values (123, 1, now());
select * from enterprise;
INSERT INTO enterprise (nome, email, telefone, cnpj, senhaHash, createdAt, updatedAt) 
VALUES ("Maersk Brasil", "contato@maersk.com.br", "(11) 9999-8888", "12.345.678/0001-90", "senha123", now(), now());

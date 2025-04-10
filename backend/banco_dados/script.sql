CREATE DATABASE imagemart DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE imagemart;

CREATE TABLE calendario (
  idcalendario int NOT NULL AUTO_INCREMENT,
  data date NOT NULL,
  descricao varchar(250) NOT NULL,
  nome varchar(250) NOT NULL,
  PRIMARY KEY (idcalendario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE imagens (
  id int NOT NULL AUTO_INCREMENT,
  caminho varchar(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE servico (
  idservico int NOT NULL AUTO_INCREMENT,
  nome varchar(250) NOT NULL,
  descricao varchar(250) NOT NULL,
  valor decimal(10,2) NOT NULL,
  PRIMARY KEY (idservico)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE tipo_usuario (
  idtipo_usuario int NOT NULL AUTO_INCREMENT,
  tipo_usuario varchar(45) NOT NULL,
  PRIMARY KEY (idtipo_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Inserção dos tipos de usuário
INSERT INTO tipo_usuario (idtipo_usuario, tipo_usuario) VALUES
(1, 'admin'),
(2, 'usuario');

CREATE TABLE usuario (
  idusuario int NOT NULL AUTO_INCREMENT,
  nome varchar(250) NOT NULL,
  email varchar(250) NOT NULL,
  senha varchar(250) NOT NULL,
  telefone varchar(45) NOT NULL,
  tipo_usuario_idtipo_usuario int NOT NULL,
  PRIMARY KEY (idusuario),
  KEY fk_usuario_tipo_usuario_idx (tipo_usuario_idtipo_usuario),
  CONSTRAINT fk_usuario_tipo_usuario FOREIGN KEY (tipo_usuario_idtipo_usuario) REFERENCES tipo_usuario (idtipo_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE pedido (
  idpedido int NOT NULL AUTO_INCREMENT,
  data timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  quantidade int NOT NULL,
  usuario_idusuario int NOT NULL,
  servico_idservico int NOT NULL,
  PRIMARY KEY (idpedido),
  KEY fk_pedido_usuario1_idx (usuario_idusuario),
  KEY fk_pedido_servico1_idx (servico_idservico),
  CONSTRAINT fk_pedido_usuario1 FOREIGN KEY (usuario_idusuario) REFERENCES usuario (idusuario),
  CONSTRAINT fk_pedido_servico1 FOREIGN KEY (servico_idservico) REFERENCES servico (idservico)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

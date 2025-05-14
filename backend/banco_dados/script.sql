CREATE DATABASE IF NOT EXISTS imagemart DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE imagemart;

CREATE TABLE calendario (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL
);

CREATE TABLE imagens (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  caminho VARCHAR(255) NOT NULL
);

CREATE TABLE tipo_usuario (
  idtipo_usuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tipo_usuario VARCHAR(45) NOT NULL
);

CREATE TABLE usuario (
  idusuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(250) NOT NULL,
  email VARCHAR(250) NOT NULL,
  senha VARCHAR(250) NOT NULL,
  telefone VARCHAR(45) NOT NULL,
  tipo_usuario_idtipo_usuario INT NOT NULL,
  passwordResetToken VARCHAR(100),
  passwordResetExpires DATETIME,
  FOREIGN KEY (tipo_usuario_idtipo_usuario) REFERENCES tipo_usuario(idtipo_usuario)
);

CREATE TABLE servico (
  idservico INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(250) NOT NULL,
  imagem VARCHAR(255)
);

CREATE TABLE pedido (
<<<<<<< HEAD
  idpedido INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  quantidade INT NOT NULL,
  usuario_idusuario INT NOT NULL,
  servico_idservico INT NOT NULL,
  FOREIGN KEY (usuario_idusuario) REFERENCES usuario(idusuario),
  FOREIGN KEY (servico_idservico) REFERENCES servico(idservico)
);

CREATE TABLE servico_variacao (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  servico_id INT NOT NULL,
  descricao VARCHAR(100) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (servico_id) REFERENCES servico(idservico) ON DELETE CASCADE
);
=======
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

-- ALTER TABLE usuarios
-- ADD COLUMN passwordResetToken VARCHAR(100),
-- ADD COLUMN passwordResetExpires DATETIME;
>>>>>>> f7fc104bddf6e16d4ee821d003765d1c4ffbe8fd

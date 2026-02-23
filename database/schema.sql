CREATE DATABASE IF NOT EXISTS web_03mc;
USE web_03mc;

CREATE TABLE IF NOT EXISTS produtos_moda (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  categoria VARCHAR(60) NOT NULL,
  marca VARCHAR(80) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  descricao TEXT NULL,
  imagem_url VARCHAR(255) NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

INSERT INTO produtos_moda (nome, categoria, marca, preco, descricao, imagem_url)
VALUES
('Vestido Midi Elegante', 'Roupa', 'Atelier Aurora', 249.90, 'Modelagem fluida para eventos noturnos.', 'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80'),
('Documentario: The First Monday in May', 'Filme', 'Andrew Rossi', 39.90, 'Documentario sobre moda e o MET Gala.', 'https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=900&q=80'),
('Album: Renaissance', 'Musica', 'Beyonce', 59.90, 'Album com forte influencia fashion e cultura pop.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80');

DROP DATABASE IF EXISTS shopdb;
CREATE DATABASE shopdb;
USE shopdb;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role ENUM('customer','admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image_url VARCHAR(512),
  stock INT DEFAULT 0 CHECK (stock >= 0),
  category_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_price DECIMAL(10,2) DEFAULT 0 CHECK (total_price >= 0),
  address TEXT,
  status ENUM('pending','paid','shipped','completed','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO users (name, email, password, role)
VALUES 
('Admin', 'admin@shop.com', '123456', 'admin'),
('Nguyen Van A', 'a@gmail.com', '123456', 'customer');

INSERT INTO products (name, description, price, image_url, stock)
VALUES
('Áo thun nam', 'Áo thun cotton 100%, thoáng mát, form rộng', 150000,
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfDEqGSn-XKV5z7UFMunVF6g7Fm9EOrSnU5g&s',
 50),

('Quần jean nữ', 'Quần jean co giãn, phong cách Hàn Quốc', 320000,
 'https://cdn.kkfashion.vn/29293-large_default/quan-jeans-nu-ong-suong-phoi-tui-qj-12.jpg',
 40),

('Áo khoác hoodie', 'Hoodie unisex, chất nỉ dày, giữ ấm tốt', 280000,
 'https://bumshop.com.vn/wp-content/uploads/2022/09/hoodie-tron-den-trum-dau.jpg',
 30);



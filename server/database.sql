DROP DATABASE IF EXISTS shopdb;
CREATE DATABASE shopdb;
USE shopdb;

-- 1️⃣ MEMBERSHIPS (Cấp độ thành viên)
CREATE TABLE memberships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  min_spending DECIMAL(10,2) NOT NULL,
  discount_percent DECIMAL(5,2) DEFAULT 0
);

-- 2️⃣ USERS (Người dùng)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password VARCHAR(100) NOT NULL,
  role ENUM('customer','admin') DEFAULT 'customer',
  total_spent DECIMAL(10,2) DEFAULT 0,
  membership_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (membership_id) REFERENCES memberships(id)
);

-- 3️⃣ PRODUCTS (Sản phẩm chính)
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  sale_percent DECIMAL(5,2) DEFAULT 0 CHECK (sale_percent >= 0 AND sale_percent <= 100),
  image_url VARCHAR(512),
  stock INT DEFAULT NULL CHECK (stock >= 0),  
  gender ENUM('Nam','Nữ','Unisex') NOT NULL,
  category ENUM('Áo','Quần','Váy','Giày','Phụ kiện') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4️⃣ PRODUCT_COLORS (Biến thể theo màu - mỗi màu 1 ảnh)
CREATE TABLE product_colors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  color_name VARCHAR(50) NOT NULL,
  color_code VARCHAR(10) DEFAULT NULL,  -- ví dụ: '#FF0000'
  image_url VARCHAR(512) NOT NULL,      -- ảnh đại diện cho màu
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 5️⃣ PRODUCT_SIZES (Biến thể size theo màu)
CREATE TABLE product_sizes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  color_id INT NOT NULL,
  size ENUM('XS','S','M','L','XL','XXL') NOT NULL,
  stock INT DEFAULT 0 CHECK (stock >= 0),
  extra_price DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (color_id) REFERENCES product_colors(id) ON DELETE CASCADE
);

-- 6️⃣ SALES (Chương trình khuyến mãi)
CREATE TABLE sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  discount_percent DECIMAL(5,2) NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7️⃣ PRODUCT_SALES (Liên kết sản phẩm - chương trình sale)
CREATE TABLE product_sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  sale_id INT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
);

-- 8️⃣ VOUCHERS (Mã giảm giá)
CREATE TABLE vouchers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_percent DECIMAL(5,2) CHECK (discount_percent >= 0 AND discount_percent <= 100),
  start_date DATE,
  end_date DATE,
  min_order_value DECIMAL(10,2) DEFAULT 0,
  applicable_category ENUM('Áo','Quần','Váy','Giày','Phụ kiện','Tất cả') DEFAULT 'Tất cả',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9️⃣ ORDERS (Đơn hàng)
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  voucher_id INT DEFAULT NULL,
  total_price DECIMAL(10,2) DEFAULT 0 CHECK (total_price >= 0),
  address TEXT,
  phone VARCHAR(20),
  status ENUM('Chờ xác nhận','Đã xác nhận','Đang giao hàng','Đã giao hàng','Đã hủy') DEFAULT 'Chờ xác nhận',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (voucher_id) REFERENCES vouchers(id)
);

-- 🔟 ORDER ITEMS (Chi tiết đơn hàng)
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  color_id INT DEFAULT NULL,
  size_id INT DEFAULT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (color_id) REFERENCES product_colors(id),
  FOREIGN KEY (size_id) REFERENCES product_sizes(id)
);

-- 1️⃣1️⃣ BANNERS (Banner quảng cáo)
CREATE TABLE banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(500) NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1️⃣2️⃣ DOANH THU (Thống kê)
CREATE TABLE revenues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_date DATE NOT NULL UNIQUE,
  total_sales DECIMAL(15,2) DEFAULT 0,
  total_orders INT DEFAULT 0
);

-- 1️⃣3️⃣ TRIGGER: Cập nhật doanh thu sau khi giao hàng
DELIMITER //
CREATE TRIGGER update_revenue_after_order
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
  IF NEW.status = 'Đã giao hàng' AND OLD.status != 'Đã giao hàng' THEN
    INSERT INTO revenues (report_date, total_sales, total_orders)
    VALUES (DATE(NEW.created_at), NEW.total_price, 1)
    ON DUPLICATE KEY UPDATE
      total_sales = total_sales + NEW.total_price,
      total_orders = total_orders + 1;
  END IF;
END //
DELIMITER ;

-- ==========================================
-- 📊 CÁC VIEW THỐNG KÊ DOANH THU
-- ==========================================

-- 1️⃣4️⃣ VIEW: Doanh thu theo ngày
CREATE OR REPLACE VIEW view_revenue_daily AS
SELECT 
  report_date AS date,
  total_sales,
  total_orders
FROM revenues
ORDER BY report_date DESC;

-- 1️⃣5️⃣ VIEW: Doanh thu theo tuần
CREATE OR REPLACE VIEW view_revenue_weekly AS
SELECT
  YEAR(report_date) AS year,
  WEEK(report_date, 1) AS week,
  MIN(report_date) AS start_of_week,
  MAX(report_date) AS end_of_week,
  SUM(total_sales) AS total_sales,
  SUM(total_orders) AS total_orders
FROM revenues
GROUP BY YEAR(report_date), WEEK(report_date, 1)
ORDER BY year DESC, week DESC;

-- 1️⃣6️⃣ VIEW: Doanh thu theo tháng
CREATE OR REPLACE VIEW view_revenue_monthly AS
SELECT 
  DATE_FORMAT(report_date, '%Y-%m') AS month,
  SUM(total_sales) AS total_sales,
  SUM(total_orders) AS total_orders
FROM revenues
GROUP BY DATE_FORMAT(report_date, '%Y-%m')
ORDER BY month DESC;

-- 1️⃣7️⃣ VIEW: Doanh thu theo năm
CREATE OR REPLACE VIEW view_revenue_yearly AS
SELECT 
  YEAR(report_date) AS year,
  SUM(total_sales) AS total_sales,
  SUM(total_orders) AS total_orders
FROM revenues
GROUP BY YEAR(report_date)
ORDER BY year DESC;

-- 1️⃣8️⃣ VIEW: Sản phẩm bán chạy nhất
CREATE OR REPLACE VIEW view_best_selling_products AS
SELECT 
  p.id AS product_id,
  p.name AS product_name,
  SUM(oi.quantity) AS total_sold,
  SUM(oi.price * oi.quantity) AS revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'Đã giao hàng'
GROUP BY p.id, p.name
ORDER BY total_sold DESC;

-- 1️⃣9️⃣ INDEX tối ưu
CREATE INDEX idx_user_membership ON users(membership_id);
CREATE INDEX idx_product_category ON products(category);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_sales_date ON sales(start_date, end_date);

INSERT INTO products (name, description, price, image_url, gender, category)
VALUES
('Áo sơ mi nam', 'Áo Sơ Mi Không Cần Ủi Dáng Ôm', 150000,
 '/public/images/ao-so-mi-nam-white.png',
 'Nam', 'Áo'),

('Quần chino nam', 'Quần Chino Dáng Slim Fit', 320000,
 '/public/images/quan-chino-nam-beige.png',
 'Nam', 'Quần'),

('Áo sơ mi nữ', 'Áo Sơ Mi Vải Linen Cao Cấp', 280000,
 '/public/images/ao-so-mi-nu-white.png',
 'Nữ', 'Áo'),

('Quần dài gear nữ', 'Quần Vải Mỏng, Mềm Mại', 450000,
 '/public/images/quan-dai-gear-nu-beige.png',
 'Nữ', 'Quần');

INSERT INTO banners (image_url, title, subtitle)
VALUES
('/public/images/banner1.png',
 'Chào mừng đến Clothing Shop',
 'Bộ sưu tập mới nhất đã có mặt – Giảm giá đến 50% hôm nay!'),

('/public/images/banner2.png',
 'Phong cách mới mỗi ngày',
 'Khám phá các mẫu áo quần hot trend'),

('/public/images/banner3.png',
 'Hàng mới về mỗi tuần',
 'Cập nhật liên tục – đừng bỏ lỡ xu hướng mới nhất'),

('/public/images/banner4.png',
 'Ưu đãi đặc biệt cuối tuần',
 'Giảm thêm 20% cho đơn hàng đầu tiên – Mua ngay hôm nay!');

INSERT INTO product_colors (product_id, color_name, color_code, image_url)
VALUES
(1, 'Trắng', '#FFFFFF', '/public/images/ao-so-mi-nam-white.png'),
(1, 'Xanh da trời', '#87CEEB', '/public/images/ao-so-mi-nam-blue.png');

INSERT INTO product_colors (product_id, color_name, color_code, image_url)
VALUES
(2, 'Be', '#F5F5DC', '/public/images/quan-chino-nam-beige.png'),
(2, 'Xanh dương', '#0000FF', '/public/images/quan-chino-nam-blue.png');

INSERT INTO product_colors (product_id, color_name, color_code, image_url)
VALUES
(3, 'Trắng', '#FFFFFF', '/public/images/ao-so-mi-nu-white.png'),
(3, 'Xanh lá', '#008000', '/public/images/ao-so-mi-nu-green.png');

INSERT INTO product_colors (product_id, color_name, color_code, image_url)
VALUES
(4, 'Be', '#F5F5DC', '/public/images/quan-dai-gear-nu-beige.png'),
(4, 'Xanh đậm', '#0A3D3B', '/public/images/quan-dai-gear-nu-green.png');

INSERT INTO product_sizes (color_id, size, stock, extra_price) VALUES
(1, 'S', 10, 0),
(1, 'M', 20, 0),
(1, 'L', 15, 0),
(2, 'S', 8, 0),
(2, 'M', 18, 0),
(2, 'L', 12, 0);

INSERT INTO product_sizes (color_id, size, stock, extra_price) VALUES
(3, 'S', 10, 0),
(3, 'M', 15, 0),
(3, 'L', 12, 0),
(4, 'S', 5, 0),
(4, 'M', 8, 0),
(4, 'L', 10, 0);

INSERT INTO product_sizes (color_id, size, stock, extra_price) VALUES
(5, 'S', 10, 0),
(5, 'M', 8, 0),
(5, 'L', 5, 0),
(6, 'S', 12, 0),
(6, 'M', 10, 0),
(6, 'L', 6, 0);

INSERT INTO product_sizes (color_id, size, stock, extra_price) VALUES
(7, 'S', 7, 0),
(7, 'M', 14, 0),
(7, 'L', 9, 0),
(8, 'S', 6, 0),
(8, 'M', 12, 0),
(8, 'L', 8, 0);



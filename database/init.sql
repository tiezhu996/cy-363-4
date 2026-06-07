CREATE TABLE IF NOT EXISTS operation_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_name VARCHAR(120) NOT NULL,
  owner_name VARCHAR(80) NOT NULL,
  status VARCHAR(40) NOT NULL,
  metric VARCHAR(40) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO operation_records (module_name, owner_name, status, metric)
VALUES ('主题房间与难度分级', '运营组', 'ready', '100%');

CREATE TABLE IF NOT EXISTS prop_themes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  room_count INT DEFAULT 0,
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prop_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  theme_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  specification VARCHAR(200),
  unit VARCHAR(20) DEFAULT '个',
  stock_quantity INT DEFAULT 0,
  warning_threshold INT DEFAULT 5,
  last_check_date DATE,
  next_check_date DATE,
  inspection_status VARCHAR(20) DEFAULT 'normal',
  remark TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (theme_id) REFERENCES prop_themes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS prop_consumptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prop_item_id INT NOT NULL,
  consumption_date DATE NOT NULL,
  quantity INT NOT NULL,
  reason VARCHAR(200) NOT NULL,
  operator VARCHAR(50),
  remark TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (prop_item_id) REFERENCES prop_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS prop_maintenances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prop_item_id INT NOT NULL,
  maintenance_date DATE NOT NULL,
  type VARCHAR(20) NOT NULL,
  description TEXT,
  cost DECIMAL(10, 2) DEFAULT 0,
  operator VARCHAR(50),
  status VARCHAR(20) DEFAULT 'completed',
  remark TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (prop_item_id) REFERENCES prop_items(id) ON DELETE CASCADE
);

INSERT INTO prop_themes (name, description, room_count) VALUES
('古堡惊魂', '中世纪古堡主题，包含大量复古道具和机关', 3),
('星际迷途', '科幻太空主题，电子道具和精密机关', 2),
('古墓探秘', '古代陵墓主题，仿古文物和神秘机关', 2);

INSERT INTO prop_items (theme_id, name, specification, unit, stock_quantity, warning_threshold, last_check_date, next_check_date, inspection_status) VALUES
(1, '铜制钥匙', '古堡大门钥匙，复古样式', '把', 12, 5, '2026-06-01', '2026-06-15', 'normal'),
(1, '密码箱', '6位数字密码，带报警装置', '个', 3, 2, '2026-06-03', '2026-06-17', 'warning'),
(1, '蜡烛台', '复古铁艺，电子蜡烛', '个', 4, 3, '2026-06-02', '2026-06-16', 'normal'),
(1, '机关齿轮', '精密黄铜齿轮组', '套', 2, 3, '2026-06-01', '2026-06-15', 'maintenance'),
(2, '指纹识别器', '光学指纹模块，USB接口', '台', 6, 3, '2026-06-04', '2026-06-18', 'normal'),
(2, 'LED指示灯条', 'RGB变色，5米长', '条', 1, 5, '2026-06-02', '2026-06-16', 'warning'),
(2, '宇航头盔道具', '带呼吸灯效果', '个', 8, 4, '2026-06-03', '2026-06-17', 'normal'),
(3, '仿古玉玺', '雕刻精细，带印章', '方', 5, 2, '2026-06-01', '2026-06-15', 'normal'),
(3, '竹简线索', '写有古文，防水处理', '卷', 3, 5, '2026-06-02', '2026-06-16', 'warning'),
(3, '石门机关', '电动触发，重量感应', '套', 2, 1, '2026-06-05', '2026-06-19', 'normal');

INSERT INTO prop_consumptions (prop_item_id, consumption_date, quantity, reason, operator) VALUES
(1, '2026-05-28', 2, '玩家游戏中丢失', '张服务'),
(2, '2026-05-30', 1, '密码输入错误次数过多损坏', '李前台'),
(4, '2026-06-02', 1, '齿轮磨损卡顿', '王维护'),
(6, '2026-06-03', 3, 'LED灯珠烧坏', '赵技术'),
(9, '2026-06-04', 2, '竹简受潮变形', '张服务');

INSERT INTO prop_maintenances (prop_item_id, maintenance_date, type, description, cost, operator, status) VALUES
(2, '2026-05-25', 'repair', '更换密码锁内部电路板', 150.00, '王维护', 'completed'),
(4, '2026-06-02', 'repair', '齿轮组清洗润滑，更换磨损齿轮', 80.00, '王维护', 'completed'),
(6, '2026-06-04', 'inspection', '全面检查电路，更换烧坏灯珠', 200.00, '赵技术', 'in_progress'),
(10, '2026-06-01', 'inspection', '电机润滑，感应传感器校准', 120.00, '赵技术', 'completed');

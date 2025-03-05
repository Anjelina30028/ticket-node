use ticket;
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Новое', 'В работе', 'Завершено', 'Отменено') DEFAULT 'Новое',
    resolution TEXT,
    cancel_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
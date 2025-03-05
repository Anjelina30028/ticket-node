const { DataTypes } = require('sequelize');
const sequelize = require('../database/ticket');

// Определение модели Ticket
const Ticket = sequelize.define('Ticket', {
    topic: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Новое', 'В работе', 'Завершено', 'Отменено'),
        defaultValue: 'Новое',
    },
    resolution: {
        type: DataTypes.TEXT,
    },
    cancel_reason: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'tickets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

// Синхронизация модели с таблицей
(async () => {
    await sequelize.sync({ alter: true });
    console.log('Таблица tickets синхронизирована');
})();

module.exports = Ticket;
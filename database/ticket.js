const { Sequelize } = require('sequelize');

// Создаем экземпляр Sequelize
const sequelize = new Sequelize('ticket', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: true, 
    port: 3307
});


// Проверяем соединение
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Подключение к базе данных успешно установлено');
    } catch (error) {
        console.error('Не удалось подключиться к базе данных:', error);
    }
})();

module.exports = sequelize;
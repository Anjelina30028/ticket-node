const {Router} = require('express')
const router = Router()
const Ticket = require('../model/tickets')
const express = require('express')

const urlencodedParser = express.urlencoded({extended: false});

router.post('/create',urlencodedParser, async (req, res) => {
    try {
        const { topic, description } = req.body;
        if (!topic || !description) {
            return res.status(400).json({ error: 'Тема и описание обязательны' });
        }
        const ticket = await Ticket.create({ topic, description });
        res.status(201).json({ message: 'Обращение создано' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера'});
    }
});

router.put('/take/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Обращение не найдено' });
        }
        if (ticket.status !== 'Новое') {
            return res.status(400).json({ error: 'Обращение уже находится в другом статусе' });
        }
        await ticket.update({ status: 'В работе' });
        res.status(200).json({ message: 'Обращение взято в работу' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 3. Завершить обработку обращения
router.put('/resolve/:id', urlencodedParser, async (req, res) => {
    try {
        const { id } = req.params;
        const { resolution } = req.body;
        if (!resolution) {
            return res.status(400).json({ error: 'Текст решения обязателен' });
        }
        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Обращение не найдено' });
        }
        if (ticket.status !== 'В работе') {
            return res.status(400).json({ error: 'Обращение должно быть "В работе"' });
        }
        await ticket.update({ status: 'Завершено', resolution });
        res.status(200).json({ message: 'Обращение завершено' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 4. Отмена обращения
router.put('/cancel/:id',urlencodedParser, async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        if (!reason) {
            return res.status(400).json({ error: 'Причина отмены обязательна' });
        }
        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Обращение не найдено' });
        }
        if (ticket.status === 'Завершено' || ticket.status === 'Отменено') {
            return res.status(400).json({ error: 'Обращение уже завершено или отменено' });
        }
        await ticket.update({ status: 'Отменено', cancel_reason: reason });
        res.status(200).json({ message: 'Обращение отменено' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 5. Получить список обращений
router.get('/list', async (req, res) => {
    try {
        const { filterDate, dateRangeStart, dateRangeEnd } = req.query;

        let where = {};
        if (filterDate) {
            where.created_at = { [Sequelize.Op.eq]: filterDate };
        } else if (dateRangeStart && dateRangeEnd) {
            where.created_at = {
                [Sequelize.Op.between]: [dateRangeStart, dateRangeEnd],
            };
        }

        const tickets = await Ticket.findAll({ where, order: [['created_at', 'DESC']] });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 6. Отменить все обращения "в работе"
router.post('/cancel-all-in-progress', async (req, res) => {
    try {
        const result = await Ticket.update(
            { status: 'Отменено', cancel_reason: 'Автоматическая отмена' },
            { where: { status: 'В работе' } }
        );
        res.status(200).json({ message: `Отменено ${result[0]} обращений` });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});


module.exports = router;
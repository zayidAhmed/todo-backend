const router = require('express').Router();
const Todo = require('../models/Todo');
const auth = require('../middleware/authMiddleware');

// Get all tasks for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.userId });
        res.json(todos);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Add a new task
router.post('/', auth, async (req, res) => {
    try {
        const todo = new Todo({
            userId: req.userId,
            text: req.body.text
        });

        await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;

const express = require('express');
const Sequelize = require('sequelize');
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World! book");
});
app.use(express.json());

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './Database/SQBooks.sqlite'
});

const Book = sequelize.define('book', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: Sequelize.STRING, allowNull: false },
    author: { type: Sequelize.STRING, allowNull: false }
});

sequelize.sync();

app.get('/books', async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        book ? res.json(book) : res.status(404).send('Book not found');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/books', async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).send(book);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (book) {
            await book.update(req.body);
            res.send(book);
        } else {
            res.status(404).send('Book not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (book) {
            await book.destroy();
            res.send({ message: 'Book deleted' });
        } else {
            res.status(404).send('Book not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}...`));
const express = require('express');
const Joi = require('joi');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const usersFilePath = 'users.txt';

const userSchema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    secondName: Joi.string().min(3).max(50).required(),
    age: Joi.number().integer().min(1).max(150).required(),
    city: Joi.string().required()
});

function getUsersFromFile() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.log(`error on read users from file: ${err}`);
        return { users: [], maxUsersId: 0 };
    }
}

function saveUsersToFile(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users));
}

app.get('/users', (req, res) => {
    const users = getUsersFromFile();
    res.json(users.users);
});

app.get('/users/:id', (req, res) => {
    const users = getUsersFromFile();
    const userId = parseInt(req.params.id);
    const user = users.users.find(u => u.id === userId);

    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

app.post('/users', (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const users = getUsersFromFile();
    let newUser = req.body;
    newUser.id = ++users.maxUsersId;
    users.users.push(newUser);
    saveUsersToFile(users);
    res.status(201).json(newUser);
});

// Маршрут обновления пользователя
app.put('/users/:id', function(req, res) {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const users = getUsersFromFile();
    const userId = parseInt(req.params.id);
    const user = users.users.find(u => u.id === userId);

    if (user) {
        // Обновление пользователя
        user.firstName = req.body.firstName;
        user.secondName = req.body.secondName;
        user.age = req.body.age;
        user.city = req.body.city;
        saveUsersToFile(users);
        res.json(user);
    } else {
        res.status(404).send('User not found for update');
    }
});

app.delete('/users/:id', (req, res) => {
    const users = getUsersFromFile();
    const userId = parseInt(req.params.id);
    const userIndex = users.users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        users.users.splice(userIndex, 1);
        saveUsersToFile(users);
        res.json({ message: 'User deleted' });
    } else {
        res.status(404).send('User not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

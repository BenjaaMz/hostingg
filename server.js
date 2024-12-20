const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User ', userSchema);

// Ruta para registrar un nuevo usuario (opcional)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const newUser  = new User({ username, password });
    await newUser .save();
    res.status(201).send('Usuario registrado');
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.status(200).send('Inicio de sesión exitoso');
    } else {
        res.status(401).send('Usuario o contraseña incorrectos');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

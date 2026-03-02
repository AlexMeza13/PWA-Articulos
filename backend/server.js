// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de conexión a MariaDB
const dbPool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Cambia por tu usuario
    password: '246812468', // Cambia por tu contraseña
    database: 'editorial_db'
});

// Endpoint para recibir evaluaciones sincronizadas
app.post('/api/evaluaciones', async (req, res) => {
    const { calificacion, decision, comentarios } = req.body;

    try {
        const [result] = await dbPool.execute(
            'INSERT INTO evaluaciones (calificacion, decision, comentarios) VALUES (?, ?, ?)',
            [calificacion, decision, comentarios]
        );
        res.status(201).json({ success: true, id_insertado: result.insertId });
    } catch (error) {
        console.error("Error al guardar en DB:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.listen(3000, () => {
    console.log('🚀 Servidor backend corriendo en http://localhost:3000');
});
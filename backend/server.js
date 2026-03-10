const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURACIÓN DE LA BASE DE DATOS
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '246812468',
    database: 'editorial_db' 
});

db.connect((err) => {
    if (err) console.error('Error conectando a MySQL:', err);
    else console.log('Conectado a la base de datos MySQL');
});

// CONFIGURACIÓN DE MULTER
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// RUTA 1: REVISOR (Obtener pendientes)
app.get('/api/articulos/pendientes', (req, res) => {
    const sql = "SELECT * FROM articulos WHERE estado = 'Enviado'";
    db.query(sql, (err, resultados) => {
        if (err) return res.status(500).json({ error: 'Error en la BD' });
        res.json(resultados);
    });
});

// RUTA 2: REVISOR (Guardar evaluación)
app.post('/api/evaluaciones', (req, res) => {
    const { articulo_id, calificacion, decision, comentarios } = req.body;
    const sqlEval = "INSERT INTO evaluaciones (articulo_id, calificacion, decision, comentarios) VALUES (?, ?, ?, ?)";
    
    db.query(sqlEval, [articulo_id, calificacion, decision, comentarios], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error guardando evaluación' });

        const sqlUpdate = "UPDATE articulos SET estado = ? WHERE id = ?";
        db.query(sqlUpdate, [decision, articulo_id], (err2, result2) => {
            if (err2) return res.status(500).json({ error: 'Error actualizando estado' });
            res.json({ mensaje: "Evaluación guardada y estado actualizado" });
        });
    });
});

// RUTA 3: AUTOR (Subir artículo)
app.post('/api/articulos', upload.single('archivo'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No archivo' });
    
    const nombreFisico = req.file.filename;
    const nombreOriginal = req.file.originalname;
    const sql = "INSERT INTO articulos (nombre_archivo_fisico, nombre_original) VALUES (?, ?)";
    
    db.query(sql, [nombreFisico, nombreOriginal], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error BD' });
        res.json({ mensaje: 'Archivo subido', archivo: nombreFisico });
    });
});

// RUTA 4: EDITOR Y AUTOR (Ver lista con comentarios unidos)
app.get('/api/articulos', (req, res) => {
    const sql = `
        SELECT articulos.id, articulos.nombre_original, articulos.estado, articulos.fecha_subida, 
               evaluaciones.calificacion, evaluaciones.comentarios 
        FROM articulos 
        LEFT JOIN evaluaciones ON articulos.id = evaluaciones.articulo_id 
        ORDER BY articulos.fecha_subida DESC
    `;
    db.query(sql, (err, resultados) => {
        if (err) return res.status(500).json({ error: 'Error en la BD' });
        res.json(resultados);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
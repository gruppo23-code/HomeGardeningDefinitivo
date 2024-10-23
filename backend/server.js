import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

import 'dotenv/config'

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const connessione = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
})

app.get('/', (req, res) => {
    res.send('Benvenuto alla homepage!');
});

app.post('/registrazione', (req, res) => {
    const sql = `INSERT INTO  utenti (nome,cognome,email,password) VALUES (?)`;

    const saltRounds = 10; // Maggiore è il numero, più sicuro sarà l'hashing, ma richiederà più tempo


    bcrypt.hash(req.body.password.toString(),saltRounds, (err,hash) => {
        if (err) {
            console.error("Errore durante l'hashing della password: ", err);
        }
        const values = [
            req.body.nome,
            req.body.cognome,
            req.body.email,
            hash,
        ]
        connessione.query(sql, [values], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log('Errore: Email già esistente nel database.');

                } else {
                    console.error("Errore durante l'esecuzione della query: ", err);
                }
            } else {
                console.log('Query eseguita con successo.');
            }
        })
    })
})


app.listen(8081, () => {
    console.log('Running...');
})

import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const connessione = mysql.createConnection({
    host: "progettohomegardening-39-gruppo39poliba-ffa8perforza.d.aivencloud.com",
    user: "avnadmin",
    password: "AVNS_HTej7D3CNCR5WYd5V4_",
    database: "homegardening",
    port: 24939,
})

app.post('/registrazione', (req, res) => {
    const sql = `INSERT INTO  utenti (nome,cognome,email,password) VALUES (?)`;

    const saltRounds = Number(1); // Maggiore è il numero, più sicuro sarà l'hashing, ma richiederà più tempo
    const pass = req.body.password.toString();
    const hash = "";


    bcrypt.hash(pass,saltRounds, (err,hash) => {
        if (err) {
            console.error("Errore durante l'hashing della password: ", err);
        }
        const values = [
            req.body.nome,
            req.body.cognome,
            req.body.email,
            hash,
        ]
        console.log('Dati ricevuti:', req.body);
        connessione.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Errore durante l'esecuzione della query: ", err);
            }
        })
    })
})


app.listen(8081, () => {
    console.log('Running...');
})

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
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

app.get('/', (req, res) => {
    res.send('Benvenuto alla homepage!');
});

//Funzione per la registrazione
app.post('/registrazione', (req, res) => {
    const sql = `INSERT INTO  utenti (nome,cognome,email,password) VALUES (?)`;

    const saltRounds = 10; // Maggiore è il numero, più sicuro sarà l'hashing, ma richiederà più tempo
    //Commentato per utilizzo di variabili d'ambiente

    bcrypt.hash(req.body.password.toString(), saltRounds, (err, hash) => {
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
            //console.log(result);
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    //Ritorno il codice ER_DUP_ENTRY al frontend
                    return res.status(409).json({error: err.code});
                } else {
                    console.error("Errore durante l'esecuzione della query: ", err);
                }
            } else {
                console.log('Query eseguita con successo.');
            }
        })
    })
})

//Funzione per il login
app.post('/login', (req, res) => {
    const query = 'SELECT password FROM utenti WHERE email = ?';
    const email = req.body.email;


    connessione.query(query, [email], (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return result.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            console.log(result)
            return res.status(404).send("Utente non trovato");
        } else if (result.length === 1) {
            bcrypt.compare(req.body.password, result[0].password, (err, match) => {
                //.compare serve a comparare le password, facendo automaticamente l'hash della password che passo
                //dal frontend; ritorna una variabile che ho chiamato match, boolean quindi true se matchano altrimenti false
                if (err) {
                    console.error("Errore durante il confronto delle password: ", err);
                    return res.status(500).json({error: err});
                }
                if (match) {
                    console.log("Le password matchano!");
                    return res.status(200).send(req.cookies);
                } else {
                    console.log("Le password non matchano!");
                    return res.status(401).json({error: err});
                }
            })
        }
    })


})


app.listen(process.env.LISTEN_PORT || 8081, () => {
    console.log('Running...');
})

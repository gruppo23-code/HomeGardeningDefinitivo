import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const connessione = mysql.createConnection({
    host: 'progettohomegardening-39-gruppo39poliba-ffa8perforza.d.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_HTej7D3CNCR5WYd5V4_',
    database: 'homegardening',
    port: 24939,
})

app.listen(8081, () => {
    console.log('Running...');
})

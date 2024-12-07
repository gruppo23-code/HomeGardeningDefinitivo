import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

import 'dotenv/config'

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"], //Che indirizzo è autorizzato a fare richieste
    methods: ['GET', 'POST'], //Quali metodi HTTP sono consentiti per le richieste
    credentials: true // Il browser invierà al backend oltre che le richieste i cookie
}));
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

//Funzione per verificare che ci sia il token nei cookie
const verificaToken = (req, res, next) => {
    const token = req.cookies.token; // Ottieni il token dai cookie

    if (!token) {
        return res.status(401).json({ error: "Accesso negato. Token mancante." });
    }

    // Verifica il token
    jwt.verify(token, process.env.PRIVATE_JWT_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token non valido." });
        }
        req.user = user; // Memorizza i dati dell'utente nella richiesta
        next(); // Passa al prossimo middleware o alla route
    });
};

app.get('/verifica-token', verificaToken, (req, res) => {
    // req.user contiene i dati dell'utente decodificati dal token
    res.json({
        nome: req.user.nome,
        cognome: req.user.cognome,
        email: req.user.email
    });
});

//Funzione per la registrazione
app.post('/registrazione', (req, res) => {
    const sql = 'INSERT INTO  utenti (nome,cognome,email,password) VALUES (?)';

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
    const query = 'SELECT * FROM utenti WHERE email = ?';
    const email = req.body.email;


    connessione.query(query, [email], (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
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
                    return res.status(400).json({error: err});
                }
                if (match) {
                    // Genero un token da memorizzare all'interno dei cookies
                    try {
                        const nome = result[0].nome;
                        const cognome = result[0].cognome;
                        const email = result[0].email;
                        const token = jwt.sign({nome, cognome, email},process.env.PRIVATE_JWT_KEY,{ expiresIn: '2h' }); //Il payload vuole il json, quindi le graffe.
                        res.cookie('token',token)
                    } catch (errore) {
                        console.error('Errore durante la firma del token:', errore);
                        return res.status(400).json(errore);
                    }
                    console.log("Le password matchano!");
                    return res.status(200).send({
                        success: true,
                        nome: result[0].nome,
                        cognome: result[0].cognome,
                    });
                } else {
                    console.log("Le password non matchano!");
                    return res.status(401).json({error: err});
                }
            })
        }
    })


})


//Funzione per le card
app.get('/cards', verificaToken,(req, res) => {
    const mail = req.user.email;
    const query = 'SELECT id FROM utenti WHERE email = ?';
    connessione.query(query,[mail], (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        const plants = "SELECT pu.id, p.nome AS name, pu.foto AS image, p.descrizione AS description FROM piante_utenti AS pu " +
            "JOIN piante AS p ON pu.pianta_id = p.id " +
            "WHERE utente_id = ?";
        connessione.query(plants,result[0].id ,(err, piante) => {
            res.json(piante);
            console.log(piante);
        })
    })
})


//Funzione per la barra di ricerca in aggiungipianta
app.get('/listapiante', (req, res) => {
    const query = 'SELECT id,nome AS name FROM piante ORDER BY name';
    connessione.query(query,(err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
        } else {
            res.json(JSON.parse(JSON.stringify(result)));
        }
    })
})

//Funzione per la gestione dell'upload da parte dell'utente di una nuova pianta
app.post('/inviapianta', verificaToken,(req, res) => {
    const sql = "INSERT INTO piante_utenti (pianta_id,utente_id,foto,data_piantata,nome_pianta)" +
        "values (?)";
    const mail = req.user.email;
    const sql_id_utente = 'SELECT id FROM utenti WHERE email = ?';
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        const id_utente = result[0].id;
        const {id, data, soprannome} = req.body;
        console.log(req.body);
        const img = req.file;
        const imgBuffer = img.buffer;

        /*const valori = [
            req.body.id,
            id_utente,
            req.body.img,
            req.body.data,
            req.body.soprannome,
        ]*/
        connessione.query(sql, [id,imgBuffer,data,soprannome], (err, result) => {
            console.log(result);
            if (err) {
                console.error("Errore: ",err);
            }
        })
    })

})

app.listen(process.env.LISTEN_PORT || 8081, () => {
    console.log('Running...');
})

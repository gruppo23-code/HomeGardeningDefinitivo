import express, {query} from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import multer from 'multer';

import 'dotenv/config'
import axios from "axios";
import { OpenAI } from 'openai';

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"], //Che indirizzo è autorizzato a fare richieste
    methods: ['GET', 'POST'], //Quali metodi HTTP sono consentiti per le richieste
    credentials: true // Il browser invierà al backend oltre che le richieste i cookie
}));
app.use(cookieParser());
const upload = multer();

const openai = new OpenAI({
    apiKey: process.env.GPT_KEY
});

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
    const sql = 'INSERT INTO  utenti (nome,cognome,email,telefono,username,password,bio,location) VALUES (?)';

    const saltRounds = 10; // Maggiore è il numero, più sicuro sarà l'hashing, ma richiederà più tempo
    //Commentato per utilizzo di variabili d'ambiente

    bcrypt.hash(req.body.password.toString(), saltRounds, (err, hash) => {
        if (err) {
            console.error("Errore durante l'hashing della password: ", err);
        }
        console.log(req.body);
        const n_telefono = "+39 " + req.body.phone;
        const values = [
            req.body.firstName,
            req.body.lastName,
            req.body.email,
            n_telefono,
            req.body.username,
            hash,
            req.body.bio,
            req.body.location,
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

app.get("/getcomuni", (req, res) => {
    const query = "SELECT istat, comune FROM comuni";
    connessione.query(query, (err, result) => {
        if (err) {
            console.error("Errore durante il recupero della lista dei comuni italiani: ",err);
        }
        console.log(result);
        res.send(result);
    })
})

//Fine funzioni per register

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
                        const token = jwt.sign({nome, cognome, email},process.env.PRIVATE_JWT_KEY,{ expiresIn: '1d' }); //Il payload vuole il json, quindi le graffe.
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

//Inizio funzioni per la gestione della dashboard
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
        const plants = "SELECT " +
            "pu.id, " +
            "p.nome AS name, " +
            "pu.foto AS image, " +
            "p.descrizione AS description, " +
            "pu.nome_pianta AS soprannome_pianta, " +
            "p.id AS id_univoco_pianta, " +
            "CASE " +
            "WHEN pi.data_irrigazione IS NOT NULL THEN DATE_FORMAT(pi.data_irrigazione, '%d-%m-%Y') " +
            "ELSE NULL " +
            "END AS data, " +
            "CASE " +
            "WHEN pi.data_irrigazione IS NOT NULL THEN CAST(pi.data_irrigazione AS TIME) " +
            "ELSE NULL " +
            "END AS ora_irrigazione " +
            "FROM " +
            "piante_utenti AS pu " +
            "JOIN " +
            "piante AS p ON pu.pianta_id = p.id " +
            "LEFT JOIN " +
            "(SELECT id_pianta, MAX(data_irrigazione) AS data_irrigazione " +
            "FROM piante_irrigate " +
            "GROUP BY id_pianta) AS pi ON pu.id = pi.id_pianta " +
            "WHERE " +
            "pu.utente_id = ?";
        connessione.query(plants,result[0].id ,(err, piante) => {
            console.log(piante);
            res.json(piante);
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
app.post('/inviapianta', verificaToken,upload.single('img'),(req, res) => {
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
        let imgBuffer = null;
        if(req.file) {
            imgBuffer = req.file.buffer;
        }
        //console.log(req.body);
        let id_utente = result[0].id;
        let {id, data, soprannome} = req.body;
        let valori = [id, id_utente, imgBuffer, data, soprannome];
        //console.log(valori);

        const sql = "INSERT INTO piante_utenti (pianta_id,utente_id,foto,data_piantata,nome_pianta)" +
            "values (?)";
        connessione.query(sql, [valori], (err, result) => {
            //console.log(result);
            if (err) {
                console.error("Errore: ",err);
            }
        })
    })

})

app.post('/delete',verificaToken,(req, res) => {
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
        const id_pianta = req.body.plantId;
        const valori = [
            id_utente,
            id_pianta,
        ]
        console.log(valori);
        const sql = "DELETE FROM piante_utenti WHERE utente_id = ? AND id = ?"
        connessione.query(sql,valori,(err, result) => {
            if (err) {
                console.error("Errore durante la query: ", err);
            }
            if (result.affectedRows === 0) {
                return res.status(404).send("Nessuna pianta eliminata!");
            } else {
                res.send("Pianta eliminata con successo!");
            }
        })
    })
})

app.post("/aggiornapianta",verificaToken,(req, res) => {
    const mail = req.user.email;
    const sql_id_utente = "SELECT id FROM utenti WHERE email = ?";
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        let id_utente = result[0].id;
        const query = "UPDATE piante_utenti SET nome_pianta = ? WHERE id = ?";
        connessione.query(query, [req.body.nickname,req.body.id], (err, result) => {
            if (err) {
                console.error("Errore durante la query: ", err);
            }
        })
    })
})

app.post("/irrigapianta",verificaToken,(req, res) => {
    const mail = req.user.email;
    const sql_id_utente = "SELECT id FROM utenti WHERE email = ?";
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        let id_utente = result[0].id;
        const query_irrigazione =  "INSERT INTO piante_irrigate (id_pianta) VALUES (?)"
        connessione.query(query_irrigazione,req.body.id_pianta , (err, result) => {
            if (err) {
                console.error("Errore durante la registrazione dell'irrigazione: ",err)
            }
        })
    })
})


//Fine dashboard

//Inizio gestione guide di coltivazione
app.post('/ricercaguide',(req, res) => {
    const sql = "SELECT g.*, p.* FROM guide g " +
        "JOIN piante p ON g.pianta_id = p.id " +
        "WHERE p.nome LIKE ?"
    const param = `%${req.body.ricerca}%`
    connessione.query(sql, [param], (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
        } else {
            //console.log(result);
            res.send(result);
        }
    })
})

app.post('/ricercaguide2', (req, res) => {
    const sql = "SELECT g.*, p.* FROM guide g " +
        "JOIN piante p ON g.pianta_id = p.id " +
        "WHERE g.id= ?";
    const param = req.body.id_pianta;
    console.log(req.body.id_pianta);
    connessione.query(sql, [param], (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
        } else {
            console.log(result);
            res.send(result);
        }
    })
})
//Fine gestione guide di coltivazione

//Inizio gestione marketplace

app.post('/aggiungiannuncio', verificaToken, upload.single('image'),(req, res) => {
    const mail = req.user.email;
    const sql_id_utente = "SELECT id FROM utenti WHERE email = ?";
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        let imgBuffer = null;
        if(req.file) {
            imgBuffer = req.file.buffer;
        }
        let id_utente = result[0].id;
        let {name,type,price} = req.body;
        let valori = [name,type,price,imgBuffer,1,id_utente];
        const sql = "INSERT INTO annunci (nome,tipo,prezzo,immagine,attivo,id_utente) " +
            "VALUES (?)";
        connessione.query(sql,[valori],(errore, r) => {
            if (errore) {
                console.error("Errore: ",errore);
            }
        })
    })
})

app.get('/listaannunci', (req, res) => {
    const query = 'SELECT a.id, a.nome as name, t.tipo as type, a.prezzo as price,immagine as img, CONCAT(u.nome,\' \' ,u.cognome) as user  FROM annunci a ' +
        'JOIN tipo_annunci t ON a.tipo = t.id ' +
        'JOIN utenti u ON u.id = a.id_utente';
    connessione.query(query,(err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
        } else {
            res.json(JSON.parse(JSON.stringify(result)));
        }
    })
})

app.post('/aggiungicarrello', verificaToken,(req, res) => {
    const mail = req.user.email;
    const sql_id_utente = "SELECT id FROM utenti WHERE email = ?";
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        const query = "INSERT INTO carrello (id_articolo,id_utente) VALUES (?)";
        let id_utente = result[0].id;
        const valori = [req.body.id,id_utente];
        connessione.query(query,[valori],(err, r) => {
            if (err) {
                console.error("Errore durante la query: ", err);
            }
        })
    })
})

app.get("/visualizzacarrello",verificaToken,(req, res) => {
    const mail = req.user.email;
    const sql_id_utente = "SELECT id FROM utenti WHERE email = ?";
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        let id_utente = result[0].id;
        const query = "SELECT c.id as id,a.nome as name, a.prezzo as price, a.id as id_articolo FROM carrello c " +
            "JOIN annunci a ON c.id_articolo = a.id " +
            "WHERE c.id_utente = ?";
        connessione.query(query,[id_utente],(err, result) => {
            if (err) {
                console.error("Errore durante la query: ", err);
            } else {
                res.status(200).send(JSON.parse(JSON.stringify(result)));
            }
        })
    })
})

app.post("/rimuoviarticolo",verificaToken,(req, res) => {
    const mail = req.user.email;
    const sql_id_utente = "SELECT id FROM utenti WHERE email = ?";
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        let id_utente = result[0].id;
        let id_articolo = req.body.id;
        const query = "DELETE FROM carrello WHERE `carrello`.`id` = ?";
        connessione.query(query,[id_articolo],(err, result) => {
            if (err) {
                console.error("Errore durante la query: ", err);
            } else {
                //console.log(JSON.stringify(result));
            }
        })
    })
})

app.post("/cancellacarrello",verificaToken,(req, res) => {
    const mail = req.user.email;
    const sql_id_utente = "SELECT id FROM utenti WHERE email = ?";
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        let id_utente = result[0].id;
        const query = "DELETE FROM carrello WHERE id_utente = ?";
        connessione.query(query,[id_utente],(err, result) => {
            if (err) {
                console.error("Errore durante la query: ", err);
            }
        })
    })
})

app.post("/acquisto", verificaToken,(req, res) => {
    const mail = req.user.email;
    const sql_id_utente = "SELECT id FROM utenti WHERE email = ?";
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        let id_utente = result[0].id;
        const acquisti = req.body;
        const query= "INSERT INTO acquisti (id_articolo, prezzo, id_utente, data, ora) " +
            "VALUES (?, ?, ?, CURDATE(), CURTIME());"
        connessione.beginTransaction((err) => {
            if (err) {
                return res.status(500).send("Errore nella transazione");
            }
            acquisti.forEach((row) => {
                connessione.query(query, [row.id_articolo,row.price,id_utente], (err, r) => {
                    if (err) {
                        return connessione.rollback(() => {
                            console.error("Errore durante l'inserimento: ", err);
                            return res.status(500).send("Errore durante l'inserimento");
                        });
                    }

                })
            })
        })
        connessione.commit((err) => {
            if (err) {
                return connessione.rollback(() => {
                    console.error("Errore durante il commit: ", err);
                    return res.status(500).send("Errore durante il commit");
                });
            }
            res.send("Acquisti inseriti con successo");
        })

    })
})

//Fine gestione marketplace

//Inizio gestione sezione community
app.post("/aggiungipost", verificaToken,(req, res) => {
    const mail = req.user.email;
    const sql_id_utente = "SELECT id FROM utenti WHERE email = ?";
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        let id_utente = result[0].id;
        const query_topic ="SELECT id FROM topics WHERE topic = ?";
        connessione.query(query_topic,req.body.topic, (err, res) => {
            const query = "INSERT INTO post (titolo, contenuto, autore, data, likes, topic) VALUES (?,?,?,NOW(),?,?)";
            connessione.query(query,[req.body.title,req.body.content,id_utente,0,res[0].id], (err, r) => {
                if (err){
                    console.error("Errore durante la query: ", err);
                    return res.status(500).send("Errore del server");
                }
                console.log("Post inserito correttamente!!!");
            })
        })
    })
})

app.post("/aggiungicommento", verificaToken,(req, res) => {
    const mail = req.user.email;
    const sql_id_utente = "SELECT id FROM utenti WHERE email = ?";
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        let id_utente = result[0].id;
        const query = "INSERT INTO commenti (id_post,autore,contenuto,data) VALUES (?,?,?,NOW())";
        connessione.query(query,[req.body.postId,id_utente,req.body.comment], (err, res) => {
            if (err) {
                console.error("Errore durante la query: ", err);
                return res.status(500).send("Errore del server");
            }
        })
    })
})

app.get("/visualizzapost", (req, res) => {
    const query = "SELECT p.id as id, p.titolo as titolo, p.contenuto as content, p.data as date, p.likes as likes, t.topic as topic, CONCAT(u.nome, \' \', u.cognome) as autore " +
        "FROM post p " +
        "JOIN topics t ON p.topic = t.id " +
        "JOIN utenti u ON p.autore = u.id";

    connessione.query(query, (err, posts) => {
        if (err) {
            console.error("Errore nella query dei post:", err);
            return res.status(500).json({ error: "Errore nel recupero dei post." });
        }

        // Creazione di un array di Promesse per ottenere i commenti di ogni post
        const postPromises = posts.map(post => {
            return new Promise((resolve, reject) => {
                const query_commenti = "SELECT c.id as id, CONCAT(u.nome, \' \', u.cognome) as author, c.contenuto as content, c.data as date FROM commenti c " +
                    "JOIN utenti u ON c.autore = u.id " +
                    "WHERE id_post = " + post.id;

                connessione.query(query_commenti, (err, comments) => {
                    if (err) {
                        console.error("Errore nella query dei commenti:", err);
                        return reject(err);
                    }

                    // Costruzione dell'oggetto post con i commenti
                    const postWithComments = {
                        id: post.id,
                        title: post.titolo,
                        content: post.content,
                        author: { name: post.autore },
                        date: post.date,
                        likes: post.likes,
                        comments: comments.map(comment => ({
                            id: comment.id,
                            author: comment.author,
                            content: comment.content,
                            date: comment.date
                        })),
                        topic: post.topic
                    };

                    resolve(postWithComments);
                });
            });
        });

        // Attendo che tutte le promesse siano risolte
        Promise.all(postPromises)
            .then(postsWithComments => {
                console.log(postsWithComments);
                res.json(postsWithComments); // Invio risposta al frontend
            })
            .catch(err => {
                console.error("Errore durante il recupero dei commenti:", err);
                res.status(500).json({ error: "Errore nel recupero dei commenti." });
            });
    });
});

app.post("/cancellacommento", verificaToken, (req, res) => {
    const query="DELETE from commenti where id = ?";
    connessione.query(query,req.body.commentId, (err, result) => {
        if (err) {
            console.error("Errore durante la cancellazione del commento:", err);
        } else {
            console.log(result);
        }
    })
})

//Fine gestione sezione community

//Inizio gestione profilo

app.get("/visualizzaprofilo", verificaToken, (req, res) => {
    const mail = req.user.email;
    const sql_id_utente = "SELECT id FROM utenti WHERE email = ?";
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        let id_utente = result[0].id;
        const query_utente = "SELECT CONCAT(nome, ' ', cognome) AS name, " +
            "comuni.comune AS location, " +
            "CONCAT(MONTHNAME(DATE(data_registrazione)), ' ', YEAR(DATE(data_registrazione))) AS joinDate, " +
            "email, telefono AS phone, username, DATE_FORMAT(data_registrazione, '%d-%m-%Y') AS registrationDate " +
            "FROM utenti " +
            "JOIN comuni ON utenti.location = comuni.istat " +
            "WHERE id = ?";
        connessione.query(query_utente,id_utente,(err, result) => {
            let userInfo = result[0];
            const query_acquisti = "SELECT a.id, an.nome AS name,DATE_FORMAT(a.data, '%d-%m-%Y') AS date,CONCAT('€',an.prezzo) AS price FROM acquisti a " +
                "JOIN annunci an ON a.id_articolo = an.id " +
                "WHERE a.id_utente = ?"
            connessione.query(query_acquisti,id_utente,(err, resu) => {
                userInfo.recentPurchases = resu;
                connessione.query("SELECT tip FROM tips", (error, r) => {
                    if (error) {
                        return console.error("Errore nella query: ",error);
                    }
                    const tipsArray = r.map(row => row.tip);
                    userInfo.personalizedTips = tipsArray;
                    //console.log(userInfo);
                    res.send(userInfo);
                })
            })
        })
    })
})

app.get("/visualizzabio", verificaToken, (req, res) => {
    const mail = req.user.email;
    const sql_id_utente = "SELECT id FROM utenti WHERE email = ?";
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        let id_utente = result[0].id;
        const query_bio = "SELECT bio FROM utenti WHERE id = ?";
        connessione.query(query_bio,id_utente , (err, result) => {
            res.send(result[0].bio);
        })
    })
})

app.post("/cambiabio", verificaToken, (req, res) => {
    const mail = req.user.email;
    const sql_id_utente = "SELECT id FROM utenti WHERE email = ?";
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        let id_utente = result[0].id;
        const query_bio = "UPDATE utenti SET bio = ? WHERE id = ?";
        connessione.query(query_bio,[req.body.bio,id_utente] , (err, result) => {
            if (err) {
                console.error("Errore: ",err);
            }
            console.log("Modifica della bio effettuata con successo!!!");
        })
    })
})

app.post("/cambiaimmagineprofilo", verificaToken,upload.single('img') , (req, res) => {
    const mail = req.user.email;
    const sql_id_utente = "SELECT id FROM utenti WHERE email = ?";
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        let imgBuffer = null;
        if (req.file) {
            imgBuffer = req.file.buffer;
        }
        let id_utente = result[0].id;
        console.log(imgBuffer);
        const query_cambia_immagine = "UPDATE utenti SET img = ? WHERE id = ?";
        connessione.query(query_cambia_immagine,[imgBuffer,id_utente] , (err, result) => {
            if (err) {
                console.error("Errore durante l'upload: ",err);
            }
            console.log(result);
        })
    })
})

app.get('/visualizzaimgprofilo', verificaToken, (req, res) => {
    const mail = req.user.email;
    const sql_id_utente = "SELECT id FROM utenti WHERE email = ?";
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        let id_utente = result[0].id;
        const query_img = "SELECT img FROM utenti WHERE id = ?";
        connessione.query(query_img,id_utente , (err, result) => {
            if (err) {
                console.error(err);
            }
            res.json(JSON.parse(JSON.stringify(result[0])));
        })
    })
})

//Fine gestione profilo

//Gestione api meteo (Richieste al db per dati personalizzati)

app.get("/latlong",verificaToken,(req, res) => {
    const mail = req.user.email;
    const sql_id_utente = "SELECT id FROM utenti WHERE email = ?";
    connessione.query(sql_id_utente,[mail] , (err, result) => {
        if (err) {
            console.error("Errore durante la query: ", err);
            return res.status(500).send("Errore del server");
        }
        if (result.length === 0) {
            return res.status(404).send("Utente non trovato");
        }
        let id_utente = result[0].id;
        const query_latlong = "SELECT c.lat AS latitudine, c.lng AS longitudine FROM utenti u " +
            "JOIN comuni c ON u.location = c.istat " +
            "WHERE id = ?";
        connessione.query(query_latlong,id_utente , (err, latLongRes) => {
            if (err) {
                console.error(err);
            }
            res.send(latLongRes[0]);
        })
    })
})

app.get('/api/weather', async (req, res) => {
    const { latitude, longitude } = req.query; // Ricevi latitudine e longitudine come parametri
    try {
        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude: latitude || 41.8919, // Valore predefinito per Roma
                longitude: longitude || 12.5113,
                current: 'temperature_2m,relative_humidity_2m,is_day,weather_code,cloud_cover,wind_speed_10m',
                timezone: 'auto',
                forecast_days: 1,
            },
        });
        res.json(response.data); // Rispondi con i dati ricevuti dall'API Open-Meteo
    } catch (error) {
        console.error('Errore durante la richiesta a Open-Meteo:', error.message);
        res.status(500).json({ error: 'Errore durante la richiesta meteo.' });
    }
});

//Fine gestione api meteo

//Gestione chatbot

app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
            error: 'Formato messaggi non valido',
            details: 'È richiesto un array di messaggi non vuoto'
        });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Sei un assistente esperto di giardinaggio. Fornisci consigli utili e pratici sulla cura delle piante, la gestione del giardino e il giardinaggio in generale. Rispondi in maniera molto breve e coincisa."
                },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        const botResponse = completion.choices[0].message.content;
        res.json({ message: botResponse });

    } catch (error) {
        console.error('Errore OpenAI:', error);

        if (error.error?.code === 'insufficient_quota') {
            return res.status(429).json({
                error: 'Servizio temporaneamente non disponibile',
                details: 'Il servizio di chat è momentaneamente non disponibile. Riprova più tardi.',
                technicalDetails: 'Quota API esaurita'
            });
        }

        res.status(500).json({
            error: 'Errore nella comunicazione con il servizio di chat',
            details: 'Si è verificato un problema durante l\'elaborazione della richiesta'
        });
    }
});

//Fine gestione chatbot


app.listen(process.env.LISTEN_PORT || 8081, () => {
    console.log('Running...');
})

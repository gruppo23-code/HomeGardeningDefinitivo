import mysql from "mysql2";

// Configura la connessione
const connessione = mysql.createConnection({
    host: "progettohomegardening-39-gruppo39poliba-ffa8perforza.d.aivencloud.com",
    user: "avnadmin",
    password: "AVNS_HTej7D3CNCR5WYd5V4_",
    database: "homegardening",
    port: 24939,
});

// Funzione per testare la connessione
const testConnessione = () => {
    connessione.connect((err) => {
        if (err) {
            console.error('Errore di connessione al database:', err);
            return;
        }
        console.log('Connessione al database riuscita!');

        // Chiudi la connessione dopo il test
        connessione.end((err) => {
            if (err) {
                console.error('Errore nella chiusura della connessione:', err);
            } else {
                console.log('Connessione chiusa.');
            }
        });
    });
};

// Esegui la funzione di test
testConnessione();

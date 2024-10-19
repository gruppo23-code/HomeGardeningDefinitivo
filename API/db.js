import mysql from "mysql"

export const db = mysql.createConnection({
    host: "progettohomegardening-39-gruppo39poliba-ffa8perforza.d.aivencloud.com",
    user: "avnadmin",
    password: "AVNS_HTej7D3CNCR5WYd5V4_",
    database: "homegardening",
    port: 24939
})
const db = require("./database");


db.all("SELECT * FROM admin", [], (err, rows) => {

    if(err){
        console.log(err);
        return;
    }

    console.log("ADMIN:");
    console.log(rows);

});


db.all("SELECT * FROM produtos", [], (err, rows) => {

    if(err){
        console.log(err);
        return;
    }

    console.log("PRODUTOS:");
    console.log(rows);

});


db.all("SELECT * FROM pedidos", [], (err, rows) => {

    if(err){
        console.log(err);
        return;
    }

    console.log("PEDIDOS:");
    console.log(rows);

});
const express = require("express")
const app = express()
const port = 3000

const mysql = require("mysql")
const config = require("./config")
const uuid = require("uuid")

app.use(express.json())

let pool = mysql.createPool({
    host     : config.host,
    user     : config.user,
    password : config.mdp,
    database : config.dbname,
    connectionLimit: config.connectionLimit
})

app.get("/", async (req, res) => {
    pool.query(`SELECT * FROM debilus JOIN braincell ON braincell.debilus = debilus.iddebilus ORDER BY braincell.updated ASC;`, (err, result) => {
        let response = {
            success : true,
            data : []
        }

        let t = {}

        result.forEach((row) => {
            if(!t[row.iddebilus]) {
                t[row.iddebilus] = {}
                t[row.iddebilus]["id"] = row.iddebilus
                t[row.iddebilus]["pseudo"] = row.pseudo
                t[row.iddebilus]["braincells"] = []
            }

            t[row.iddebilus]["braincells"].push({
                idbraincell : row.idbraincell,
                updated : row.updated,
                count : row.count
            })
        })


        Object.keys(t).forEach((keys) => {
            response.data.push(t[keys])
        })

        res.json(response)
    })
})

app.put("/register", async (req, res) => {
    let body = req.body

    pool.query(`INSERT INTO debilus (idDebilus, pseudo) VALUES ("${body.id}", "${body.pseudo}");`, (err, result) => {
        let success = err ? false : true
        let pseudo = body.pseudo
        let id = body.id

        if(!success) res.json({ success, message : `<@${id}> a déjà été enregister.`, id, pseudo})
        else res.json({ success, message : `<@${id}> à été enregistrer avec succès !`, id, pseudo})
    })

})

app.get("/:id", (req, res) => {
    let id = req.params.id

    pool.query(`SELECT * FROM debilus JOIN braincell ON braincell.debilus = debilus.iddebilus WHERE iddebilus LIKE "${id}" ORDER BY braincell.updated ASC;`, (err, result) => {
        if(result.length <= 0) {
            res.json({ success : false, message : `<@${id}> n'as pas été enregistrer ou n'as pas de neuronnes.`, id })
        } else {
            let response = {
                success: true
            }
            response["data"] = {}
            response["data"]["id"] = result[0].iddebilus
            response["data"]["pseudo"] = result[0].pseudo
            response["data"]["braincells"] = []

            result.forEach((row) => {
                response["data"]["braincells"].push({
                    idbraincell: row.idbraincell,
                    updated: row.updated,
                    count: row.count
                })
            })

            res.json(response)
        }
    })
})

app.put("/addbraincell", (req, res) => {
    let id = req.body.id
    let braincell = req.body.braincell

    pool.query(`INSERT INTO braincell (idbraincell, count, debilus) VALUES ("${uuid.v4()}", ${braincell}, "${id}");`, (err, result) => {
        let success = err ? false : true

        if(!success) res.json({ success, message : `<@${id}> n'est pas enregistrer.`, id})
        else res.json({ success, message : `${braincell + (braincell > 1 ? " neuronnes ont" : " neuronnes a")}  bien été ajouter à <@${id}>`, id, braincell})
    })
})



app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

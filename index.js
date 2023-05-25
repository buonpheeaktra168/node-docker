const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./db");

const path = "/api/v1";

const app = express();
const jsonParser = bodyParser.json();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get(`${path}/schools/list`, async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM schools");
    res.send(data.rows);
  } catch {
    res.status(500).send("Error Occurs");
  }
});

app.get(`${path}/schools/list/:id`, (req, res) => {
  try {
    const id = req.params.id;
    console.log(req.params);
    pool.query("SELECT * FROM schools WHERE id = $1", [id], (error, results) => {
      if(error) throw error;
      res.send(data.rows);
    });
  } catch {
    res.status(500).send("Error Occurs");
  }
});

app.post(`${path}/schools/add`, jsonParser, async (req, res) => {
  try {
    await pool.query("INSERT INTO schools (name, address) VALUES ($1,$2)", [
      req.body.name,
      req.body.address,
    ]);
    res.status(200).send(`${req.body.name} is inserted`);
  } catch (error) {
    res.status(500).send("Error Occurs");
  }
});

app.delete(`${path}/schools/delete/:id`, jsonParser, (req, res) => {
  try {
    const id = req.params.id;
    console.log(req.params);
    pool.query("DELETE FROM schools WHERE id=$1", [id], (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`School is deleted with ID: ${id}`);
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put(`${path}/schools/list:id`, jsonParser, async (req, res) => {
  try {
    console.log(req.params);
    const id = req.params.id;
    const { name, address } = req.body;
    pool.query("UPDATE schools SET name = $1, address = $2 WHERE id = $3", [name, address, id], (error, data) => {
        if (error) {
          throw error;
        } else {
          console.log(res)
          res.status(200).send(`${name} is updated successfully.`);
        }
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get(`${path}/migrate`, async (req, res) => {
  try {
    await pool.query(
      "CREATE TABLE schools( id SERIAL PRIMARY KEY, name VARCHAR(100), address VARCHAR(100))"
    );
    res.send("DB Created");
  } catch (error) {
    res.status(500).send("Error occurs");
  }
});

app.listen(3000, (req, res) => {
  console.log("Running at 3000");
});

const express = require("express");
const { UserModel, TodoModel} = require("./db");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "asd123";

mongoose.connect("");

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    await UserModel.create({
        email: email,
        password: password,
        name: name
    });

    res.json({
        message: "You have signed-up"
    })
});

app.post("/signin", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email,
        password: password
    });

    if(user) {
        const token = jwt.sign({
            userId: user._id.toString()
        }, JWT_SECRET);
        res.json({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
});

app.post("/todo", auth, function (req, res) {
    const userId = req.userId;
    const title = req.body.title;

    TodoModel.create({
        title: title,
        userId: userId
    });

    res.json({
        message: "Todo Created"
    });
});

app.get("/todos", auth, async function (req, res) {
    const userId = req.userId;
    const user = await UserModel.find({
        userId
    })

    res.json({
        
    });
});

function auth(req, res, next) {
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRET);

    if(decodedData) {
        req.userId = decodedData.userId;
        next();
    } else {
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
}

app.listen(3000);
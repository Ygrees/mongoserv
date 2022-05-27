const express = require("express")
const session = require("express-session")
const MongoDBS = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser")
const connectDB = require("./config/db");
const config = require("./config/db.config");
const path = require("path");
const mongoURI = config.url;
const app = express();
const port = 4000;

connectDB().then(() => console.log("Database Connected"))

const store = new MongoDBS({
    uri: mongoURI,
    collection: "mySessions",
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: store,
    })
)


app.use('/admin', require("./routes/admin-main-page"))
app.get('/main', (req, res) => {
    res.render(__dirname+'/front/main.ejs')
})


app.listen(process.env.PORT || 4000)
console.log(`App listening at http://localhost:${port}/main`
);

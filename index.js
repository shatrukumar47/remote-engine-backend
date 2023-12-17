const express = require("express");
const cors = require("cors");
const { connection } = require("./db");
const { skillRouter } = require("./app/routes/skillRoutes");
const { clientRouter } = require("./app/routes/clientRoute");
const { developerRouter } = require("./app/routes/developerRoutes");

const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(cors());
app.use("/skills", skillRouter)
app.use("/developer", developerRouter)
app.use("/client", clientRouter)


app.get("/", (req, res)=>{
    res.send("Welcome to Remote Engine Backend")
})

app.listen(PORT, async ()=>{
    try {
        await connection;
        console.log(`Server is live at Port ${PORT}`);
        console.log("Connected to DB")
    } catch (error) {
        console.log(error)
    }
})
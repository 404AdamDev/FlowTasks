require(dotenv).config()
const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 3000
const users = require("./routes/users");
const tasks = require("./routes/tasks");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

app.use("/api/users", users);
app.use("/api/tasks", tasks);

app.listen(PORT, () => {
    console.log(`API rodando na porta http://localhost:${PORT}`)
});
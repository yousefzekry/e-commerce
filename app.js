const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("get request working");
});

const port = 5000;
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});

const express = require("express");
const app = express();
const PORT = 3333

app.post("/", (request, response) => {
  const {name, email, password} = request.body;

  response.json({name, email, password})
})

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
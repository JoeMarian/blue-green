// app.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const APP_COLOR = process.env.APP_COLOR || 'blue';

app.get('/', (req, res) => {
  res.send(`<h1 style="color:${APP_COLOR}">Hello from ${APP_COLOR} environment!</h1>`);
});

app.listen(PORT, () => console.log(`App running on port ${PORT} in ${APP_COLOR} environment`));

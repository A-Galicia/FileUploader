const Express = require('express');
const app = Express();

app.get('/', (req, res) => {
  res.send('hello world');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

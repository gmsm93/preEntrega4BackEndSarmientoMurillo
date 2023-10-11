const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const exphbs = require('express-handlebars');
const fs = require('fs');

const PORT = 8080;

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.json());

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use('/', viewsRouter);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

http.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
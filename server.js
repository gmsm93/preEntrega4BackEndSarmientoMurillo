const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const exphbs = require('express-handlebars');


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

app.get('/add-product', (req, res) => {
  res.render('addProduct');
});

app.post('/add-product', (req, res) => {
  if (err) {
    console.error(err);
    res.status(500).send('Error al agregar los productos');
  } else {
    res.redirect('/product-list');
  }
});

app.get('/product-list', (req, res) => {
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
    } else {
      const products = JSON.parse(data);
      res.render('productList', { products });
    }
  });
});

http.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

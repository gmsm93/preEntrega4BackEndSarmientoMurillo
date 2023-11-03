const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const exphbs = require('express-handlebars');
const ProductManager = require('./models/ProductManager'); 


const PORT = 8080;

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.json());

const productManager = new ProductManager(); 


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
  const newProduct = req.body;
  productManager.addProduct(newProduct); 
  res.redirect('/product-list');
});

app.get('/product-list', (req, res) => {
  const products = productManager.getAllProducts();
  res.render('productList', { products });
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Error interno del servidor');
});


http.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

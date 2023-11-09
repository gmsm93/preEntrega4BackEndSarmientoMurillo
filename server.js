const express = require('express');
const app = express();
const http = require('http').createServer(app);
// const io = require('socket.io')(http);
const fs = require('fs');
const exphbs = require('express-handlebars');
const ProductManager = require('./models/ProductManager'); 
const dbConnect = require('./models/mongo')

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const productsRouter = require('./routes/productsRouter');
const User = require('./models/userModel');

const PORT = 8080;
const DB_URI = "mongodb+srv://r2:L53I9bfZi00L9BkV@clusterr2.028npj6.mongodb.net/?retryWrites=true&w=majority";
    
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.json());

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
  })
  .catch((err) => {
    console.error('Error de conexión a la base de datos:', err);
  });

const productManager = new ProductManager(); 

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(session({
  secret: 'supersecreto',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: DB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } 
}));

app.use('/auth', authRoutes); 

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use('/', viewsRouter);

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

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

dbConnect()

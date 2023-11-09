const mongoose = require("mongoose");

const dbConnect = () => {
    const DB_URI = "mongodb+srv://r2:L53I9bfZi00L9BkV@clusterr2.028npj6.mongodb.net/?retryWrites=true&w=majority";
    mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true } )
    .then(() => console.log('**** CONEXION CORRECTA ****'))
    .catch((err) => { console.error(err); });    
};

module.exports = dbConnect;
const getProductPage = (req, res) => {
    const user = req.session.user;
    if (user) {
      res.render('products', { user });
    } else {
      res.redirect('/login');
    }
  };
  
  module.exports = {
    getProductPage
  };
  
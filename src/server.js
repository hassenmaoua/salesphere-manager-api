require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use('/public', express.static('public'));
app.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'Bearer, Origin, Content-Type, Accept'
  );
  next();
});

// app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).sendFile('index.html', { root: 'public' });
});

const userRoutes = require('./routes/user.routes');
app.use('/api', userRoutes);

const settingsRoutes = require('./routes/settings.routes');
app.use('/api', settingsRoutes);

const productRoutes = require('./routes/product.routes');
app.use('/api', productRoutes);

const clientRoutes = require('./routes/client.routes');
app.use('/api', clientRoutes);

const supplierRoutes = require('./routes/supplier.routes');
app.use('/api', supplierRoutes);

const documentRoutes = require('./routes/document.routes');
app.use('/api', documentRoutes);

require('./routes/auth.routes')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on on PORT:', PORT);
});

module.exports = { app };

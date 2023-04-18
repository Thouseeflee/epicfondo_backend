const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const port = process.env.PORT || 3000
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost/mydatabase';
// const uri = process.env.MONGODB_URI || 'mongodb://localhost/mydatabase';

// Allow cross-origin requests from all domains
app.use(cors());
    // app.use(cors({
    //     origin: ['http://192.168.1.8:4000', `http://127.0.0.1:5173`]
    // }));

if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Serve JavaScript modules with the correct MIME type
app.get('*.js', (req, res, next) => {
    res.type('application/javascript');
    next();
  });
  

// Your other middleware and routes here...

const router = require('./routes/api/contentRoute');

// connect to mongodb
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// use body-parser middleware
app.use(bodyParser.json());

// use the router middleware
app.use('/api/posts', router);


app.get('/api/data', (req, res) => {
    const data = {
        message: 'Hello, world!'
    };
    res.json(data);
});

// route for not found (404) errors
// app.use((req, res, next) => {
//     res.status(404).render('404', { title: 'Page Not Found' });
//   });

//   // error handling middleware
//   app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).render('500', { title: 'Server Error' });
//   });


// app.listen(3000, '192.168.1.8', () => {
//     console.log('Server started on port 3000');
// });



app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
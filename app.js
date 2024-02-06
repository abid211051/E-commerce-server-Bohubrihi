// require('express-async-error');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const userRouter = require('./routers/userRouter');
const categoryRouter = require('./routers/categoryRouter');
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/server/user', userRouter);
app.use('/server/category', categoryRouter)
module.exports = app;
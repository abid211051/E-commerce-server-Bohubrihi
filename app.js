// require('express-async-error');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('uploads'));

const userRouter = require('./routers/userRouter');
const categoryRouter = require('./routers/categoryRouter');
const productRouter = require('./routers/productRouter');
const cartRouter = require('./routers/cartRouter');
const profileRouter = require('./routers/profileRouter');
const couponRouter = require('./routers/couponRouter');
const orderRouter = require('./routers/orderRouter');
const reviewRouter = require('./routers/reviewRouter');


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/server/user', userRouter);
app.use('/server/category', categoryRouter);
app.use('/server/product', productRouter);
app.use('/server/cart', cartRouter);
app.use('/server/profile', profileRouter);
app.use('/server/coupon', couponRouter);
app.use('/server/payment', orderRouter);
app.use('/server/review', reviewRouter);
module.exports = app;
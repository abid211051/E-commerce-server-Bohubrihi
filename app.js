// require('express-async-error');
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("uploads"));

const userRouter = require("./routers/userRouter");
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");
const cartRouter = require("./routers/cartRouter");
const profileRouter = require("./routers/profileRouter");
const couponRouter = require("./routers/couponRouter");
const orderRouter = require("./routers/orderRouter");
const reviewRouter = require("./routers/reviewRouter");
const googleRouter = require("./routers/googleRouter");
const facebookRouter = require("./routers/facebookRouter");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/profile", profileRouter);
app.use("/coupon", couponRouter);
app.use("/payment", orderRouter);
app.use("/review", reviewRouter);
app.use("/auth/google", googleRouter);
app.use("/auth/facebook", facebookRouter);
module.exports = app;

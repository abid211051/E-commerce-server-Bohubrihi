require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log(`mongoDb connected successfully`))
  .catch((err) => console.log(err.message));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});

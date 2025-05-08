const router = require("express").Router();
const {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  filterProduct,
  getTrendingHot,
} = require("../controllers/productController");
const isadmin = require("../middleware/isadmin");
const authorize = require("../middleware/authorize");
const uploads = require("../multer");

router
  .route("/")
  .post([authorize, isadmin], uploads.array("photo"), createProduct)
  .get(getProducts);

router
  .route("/single/:id")
  .get(getProductById)
  .put([authorize, isadmin], uploads.array("photo"), updateProduct);

router.route("/filter").post(filterProduct);

router.route("/trendinghot").get(getTrendingHot);
module.exports = router;

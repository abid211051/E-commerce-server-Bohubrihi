const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e8)
        cb(null, uniquesuffix + file.originalname);
    }
})

const uploads = multer({ storage: storage });
module.exports = uploads;
var express = require("express");
var router = express.Router();
var Article = require("../models/article");

/* GET home page. */
router.get("/", function (req, res, next) {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render("index", { articles });
  });
});

module.exports = router;

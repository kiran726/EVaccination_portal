var express = require("express")
var router = express.Router();

router.get("/news", ( req,res ) => {
    res.render("News/index", { page: 'index' } )
} ) 
module.exports = router
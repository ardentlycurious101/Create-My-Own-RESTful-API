const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

/* ------------------------------------------- Mongoose ------------------------------------------- */

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

/* ------------------------------------------- Requests targetting all articles ------------------------------------------- */

app.route("/articles")

  .get((req, res) => {
    Article.find((err, foundArticles) => {
      res.send(foundArticles);
    })
  })

  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save((err, article) => {
      if (err) return console.error(err);
      res.send(article.title + " is successfully posted!");
    });
  })

  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (err) console.error(err);
      res.send("Successfully deleted all articles!");
    });
  });

  /* ------------------------------------------- Requests targetting specific articles ------------------------------------------- */

app.route("/articles/:articleTitle")

  .get((req, res) => {
    Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
      if (err) console.error(err);
      res.send(foundArticle);
    });
  })

  .post((req, res) => {
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      (err) => {
        if (err) { console.error(err) }
        else res.send("Successfully posted " + req.body.title +"!");
      }
    )
  })

  .patch((req, res) => {
    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      (err) => {
        (err) ? res.send(err) : res.send("Successfully patched " + req.params.articleTitle + "!");
      }
    )
  })

  .delete((req, res) => {
    Article.deleteOne(
      {title: req.params.articleTitle},
      (err) => {
        (err) ? res.send(err) : res.send("Successfully deleted " + req.params.articleTitle + "!");
      }
    )
  });

/* ------------------------------------------- Others ------------------------------------------- */

app.listen(3000, ()=>{
  console.log("Server running successfully on port 3000!");
});

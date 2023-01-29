const express = require('express')
const newLocal = 'mongoose'
const mongoose = require(newLocal)
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()
/* 
mongoose.connect('mongodb://localhost:27017/', {
  useNewUrlParser: true, useUnifiedTopology: true
}) */
const URI = 'mongodb+srv://admin:1234567890@cluster0.qhjsf8y.mongodb.net/?retryWrites=true&w=majority';
mongoose.set('strictQuery', true);
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})

app.use('/articles', articleRouter)

app.listen(5000)
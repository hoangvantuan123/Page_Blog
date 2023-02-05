const express = require('express');

const Article = require('./models/article');
const articleRouter = require('./routes/articles');
const methodOverride = require('method-override');

const app = express();
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/* 
mongoose.connect('mongodb://localhost:27017/', {
  useNewUrlParser: true, useUnifiedTopology: true
}) */

/* const URI = 'mongodb+srv://admin:1234567890@cluster0.qhjsf8y.mongodb.net/?retryWrites=true&w=majority';
mongoose.set('strictQuery', true);
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
 */

const MongoDBURI = process.env.MONGO_URI || 'mongodb+srv://admin:1234567890@cluster0.qhjsf8y.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MongoDBURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))


app.use(express.static(__dirname + '/views'));
const index = require('./routes/index');
app.use('/', index);

/* app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
}) */

app.use('/articles', articleRouter)

app.listen(5000)
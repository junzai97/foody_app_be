const express = require('express');
require('./config/mysql');
const indexRouter = require('./routers/index.router');
const userRouter = require('./routers/users.router');
const meatRouter = require('./routers/meats.router');
const postRouter = require('./routers/posts.router');

const app = express();

//Add in the routes path under here
app.use(express.json());
app.use(indexRouter);
app.use(userRouter);
app.use(meatRouter);
app.use(postRouter);

module.exports = app;
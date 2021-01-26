const express = require('express');
require('./config/mysql');
const indexRouter = require('./routers/index.router');
const userRouter = require('./routers/users.router');
const meatRouter = require('./routers/meats.router');
const mealRouter = require('./routers/mealSuggestion.router');
const chatRouter = require('./routers/chat.router');
const preferenceRouter = require('./routers/preferences.router');
const friendRouter = require('./routers/friends.router');
const postRouter = require('./routers/posts.router');
const commentRouter = require('./routers/comments.router');
const bodyParser = require("body-parser");
const app = express();

//Add in the routes path under here
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use(bodyParser.text({ limit: '200mb' }));
app.use(indexRouter);
app.use(userRouter);
app.use(chatRouter);
app.use(meatRouter);
app.use(mealRouter);
app.use(preferenceRouter);
app.use(friendRouter);
app.use(postRouter);
app.use(commentRouter);

module.exports = app;
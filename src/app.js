const express = require('express');
require('./db/mysql');
const indexRouter = require('./routers/index');
const userRouter = require('./routers/users');

const app = express();


//Add in the routes path under here
app.use(express.json());
app.use(indexRouter);
app.use(userRouter);

module.exports = app;
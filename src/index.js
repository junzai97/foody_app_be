const app = require('./app');
const port = process.env.PORT || 3000;

// require('dns').lookup(require('os').hostname(), function (err, add, fam) {
//     console.log('addr: ' + add);
//   });

app.listen(port, () => {
    console.log("Server is up on port " + port);
});
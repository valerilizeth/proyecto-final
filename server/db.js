// mongose
const mongoose = require('mongoose');

const dbConnection = async () => {
    const URL_BD = 'mongodb+srv://estefalizeth1999:lwX8QkQJ24xwfwwk@cluster0.mgkth6y.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(URL_BD).then(() => {
        console.log('Database connected');
    }, (err) => {
        console.log(err);
    });
}

module.exports = dbConnection
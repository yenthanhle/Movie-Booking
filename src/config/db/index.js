const mongoose = require('mongoose')
async function  connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/YT_Movies', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
        });
        console.log('Connect successfully!!!')
    } catch (e) {console.log(e)}

}

module.exports = {connect}
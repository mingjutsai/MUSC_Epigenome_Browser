const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//connect to mongoDB
const db_ip = process.env.MONGO_IP;
const db_port = process.env.MONGO_PORT;
const db_name = process.env.MONGO_DB;
const db_user = process.env.MONGO_USER;
const db_password = process.env.MONGO_PWD;
const MONGO_URI = `${db_ip}:${db_port}`;
const db_URI = `mongodb://${db_user}:${db_password}@${MONGO_URI}/${db_name}`;
//const db_URI = `mongodb://${MONGO_URI}/${db_name}`;
console.log(`db_URI: ${db_URI}`);
//mongoose.connect(db_URI, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose
  .connect(db_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected successfully'))
  .catch(err => console.log(err));

//const connection = mongoose.connection;
//connection.once('open', () => {
//    console.log("MongoDB database connection established successfully");
//});

//routes
const snpRouter = require('./routes/snp');
const snp2geneRouter = require('./routes/snp2gene');
const diseaseRouter = require('./routes/disease');
const promoterhMSCRouter = require('./routes/promoterhMSC');
const promoterhMSC2geneRouter = require('./routes/promoterhMSC2gene');
const promoterOBRouter = require('./routes/promoterOB');
const promoterOB2geneRouter = require('./routes/promoterOB2gene')
const promoterOCRouter = require('./routes/promoterOC');
const promoterOC2geneRouter = require('./routes/promoterOC2gene')
const writeLocalFile = require('./routes/writefile');

app.use('/snp', snpRouter);
app.use('/snp2gene', snp2geneRouter);
app.use('/disease', diseaseRouter);
app.use('/promoterhMSC', promoterhMSCRouter);
app.use('/promoterhMSC2gene', promoterhMSC2geneRouter);
app.use('/promoterOB',promoterOBRouter);
app.use('/promoterOB2gene', promoterOB2geneRouter);
app.use('/promoterOC',promoterOCRouter);
app.use('/promoterOC2gene', promoterOC2geneRouter);
app.use('/writeFile', writeLocalFile);
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const db = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(db)
    .then(() => console.log('DB connection successful!'))
    .catch((err) => console.log(''));

const port = process.env.PORT || 8001;

const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

import express from 'express';
import 'reflect-metadata';
import { postgresDataSource } from './config/database';

postgresDataSource
    .initialize()
    .then(() => {
        console.log('Database initialized');
    })
    .catch((err) => {
        console.log('Error connecting to initialized: ', err);
    });

export const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200);
    res.send();
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

import express from 'express';
import 'reflect-metadata';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Worldaa');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

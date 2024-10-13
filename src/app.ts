import express from 'express';
import 'reflect-metadata';

export const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200);
    res.send();
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server in ${process.env.NODE_ENV} is running on port ${port}`);
});

const express = require('express');
const userRouter = require('./src/routes/userRoute');

const app = express();
const port = 5000;

app.use(express.json());

app.use('/api/v1/', userRouter);

app.listen(port, () => console.log(`Server Running on Port: ${port}!`));
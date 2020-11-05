// code away!
const server = require('./server');
const userRouter = require('./users/userRouter');

server.use('/api/user', userRouter)

const PORT = 4000;

server.listen(PORT)
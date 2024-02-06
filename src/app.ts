import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import { v4 as uuidv4 } from 'uuid';

const app = Fastify();

interface UsersType {
  id: string,
  email: string,
  name: string
};

let users: UsersType[] = [];

// list all users
app.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.send(users);
});

// add user
app.post('/users', async (request: FastifyRequest<{ Body: UsersType }>, reply: FastifyReply) => {
  const { email, name } = request.body;
  const findUserByEmail = users.find(user => user.email === email);
  if (findUserByEmail) {
    reply.code(500).send({ message: 'User already exists!' });
  } else {
    users.push({
      "id": uuidv4(),
      "email": email,
      "name": name 
    });
  return reply.send({ message: 'OK' });
  }
});

// update user
app.put('/users', async (request: FastifyRequest<{ Body: UsersType }>, reply: FastifyReply) => {
  const { email, name } = request.body;
  const index = users.findIndex(user => user.email === email);
  if (index === -1) {
    reply.code(404).send({ message: 'User not found' });
    return;
  }
  users[index].name = name;
  return users[index];
});

// delete user
app.delete('/users', async (request: FastifyRequest<{ Body: UsersType }>, reply: FastifyReply) => {
  const { email } = request.body;
  const index = users.findIndex(user => user.email === email);
  if (index === -1) {
    reply.code(404).send({ message: 'User not found' });
    return;
  }
  users.splice(index, 1);
  reply.code(204).send();
});

// route params
app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running on port 3333!');
});

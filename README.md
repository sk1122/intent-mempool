# Mempool

- RabbitMQ Queue
- Database

Solver subscribe to websocket with list of types, they will be provided those types

# Solver

- RabbitMQ Queue

Solver will add those types to its local queue and processes them with workers, they take those intents and solve them using an algorithm
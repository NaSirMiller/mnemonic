FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Use ENV for port configuration
ENV PORT=${BACKEND_PORT}

# Use CMD with port from environment
CMD ["sh", "-c", "npm run start:dev -- -p $PORT"]

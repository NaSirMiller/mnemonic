FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=${FRONTEND_PORT}

# Start Vite with configurable port
CMD ["sh", "-c", "npm run dev -- --port $PORT"]

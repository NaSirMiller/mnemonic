FROM node:20

WORKDIR /app/backend

# 1) Install backend dependencies
COPY backend/package*.json ./
RUN npm install

# 2) Copy backend source code
COPY backend ./

# 3) Copy shared models into /app/shared
COPY shared /app/shared

# 4) Start the dev server
CMD ["npm", "run", "start:dev"]

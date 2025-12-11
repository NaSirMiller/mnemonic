FROM node:20

WORKDIR /app/frontend

# 1) Install frontend dependencies
COPY frontend/package*.json ./
RUN npm install

# 2) Copy frontend source
COPY frontend ./

# 3) Start Vite dev server
EXPOSE 5173
CMD ["npm", "run", "dev"]

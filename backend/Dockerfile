# --- env setup ---
# use official node 20 image (includes node.js + npm)
from node:20

# set working directory inside the container
workdir /app

# --- application setup ---
# copy dependency files first for layer caching
copy package*.json ./

# install dependencies inside the container
run npm install

# copy the rest of the frontend files
copy . .

# expose port for vite (default 5173)
expose 5000

# start the development server
cmd ["npm", "run", "start:dev"]

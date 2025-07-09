FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with fallback
RUN npm install --only=production || \
    (rm -rf node_modules package-lock.json && npm install --only=production)

# Copy source code
COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]

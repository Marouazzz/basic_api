FROM node:18-alpine

WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source
COPY . .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
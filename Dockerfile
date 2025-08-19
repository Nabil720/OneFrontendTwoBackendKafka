FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Final image
FROM node:18-alpine

WORKDIR /app
RUN npm install -g http-server

COPY --from=builder /app/build /app

EXPOSE 3000

CMD ["http-server", "-p", "3000"]

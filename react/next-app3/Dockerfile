FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --registry=https://registry.npmmirror.com
CMD  npm run build && npm start
EXPOSE 3000
#prepare nodejs environment 16/alpine
FROM node:16.20.2-alpine

#Define directory in Docker
WORKDIR /scm-api/backend

# Copy wait-for.sh
COPY wait-for.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/wait-for.sh
RUN apk add --no-cache curl netcat-openbsd

# Copy and install dependencies
COPY package*.json ./
RUN npm install
RUN npm install -g @babel/core @babel/cli

# Copy the rest of the application
COPY . .

RUN npm run build-src

# Use the absolute path to wait-for.sh
CMD ["sh", "-c", "/usr/local/bin/wait-for.sh db-mysql 3306 -- npm run migrate:up && npm run build"]

#docker build --tag node-scm-docker .
#docker run -p 8080:8080 -d node-scm-docker
FROM node
WORKDIR /usr/app
COPY . .
EXPOSE 5000
RUN npm install
RUN npm run docker:build

CMD ["npm", "run", "docker:start"]
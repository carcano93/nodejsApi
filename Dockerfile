FROM node

WORKDIR /home/node/api
ENV NODE_ENV=production
COPY ./api /
RUN ls
RUN npm i
EXPOSE 3000
CMD ["node", "bin/www"]

 
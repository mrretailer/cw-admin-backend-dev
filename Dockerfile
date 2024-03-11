FROM public.ecr.aws/docker/library/node:18

WORKDIR /app/cw-admin-backend/

RUN npm install -g nodemon
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --silent
RUN npm install -g sequelize-cli
# If you are building your code for production
#RUN npm ci --only=production

## Bundle app source
COPY . .

EXPOSE 3001
##
CMD [ "npm", "run", "start" ]

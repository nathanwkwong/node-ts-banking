###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As builder

WORKDIR /home/node

ENV NODE_ENV production

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production

#  Remove the prepare script and install only production dependencies
RUN npm pkg delete scripts.prepare && npm ci --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine as production

WORKDIR /home/node

ENV NODE_ENV production

USER node

# Copy the bundled code from the build stage to the production image
COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

# Exposed ports by the container
EXPOSE 3000

CMD ["node", "dist/app.js"]
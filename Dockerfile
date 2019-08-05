#---dependencies---#
#---install full test and build deps and separate copy of runtime deps---#
FROM node:10.15.3-alpine AS deps

ARG npmUri
ARG npmAuthToken

ARG NODE_ENV

COPY package.json /tmp
COPY yarn.lock /tmp
WORKDIR /tmp
RUN echo "\"registry\" \"https://${npmUri}/:_authToken=${npmAuthToken}\"" > ~/.yarnrc
RUN yarn --production
RUN rm ~/.yarnrc
RUN cp -R node_modules prod_node_modules
RUN yarn

#---build---#
#---build our typescript for release---#
FROM node:10.15.3-alpine AS build

ARG NODE_ENV

COPY . /build
WORKDIR /build

COPY --from=deps /tmp/node_modules ./node_modules
RUN yarn run build

# #---tests---#
# #---run tests---#
FROM node:10.15.3-alpine AS test

ARG NODE_ENV

COPY . /tests
WORKDIR /tests
COPY --from=deps /tmp/node_modules ./node_modules
# since routes.test is generated, we need to make sure it's present for tests
RUN yarn run build
ENV CI=true
RUN yarn run test


#---release---#
#---copy production dependencies and build typescript and run!---#
FROM build AS release

ARG NODE_ENV

WORKDIR /app

COPY --from=build /build/build ./build
COPY --from=deps /tmp/package.json .
COPY --from=deps /tmp/prod_node_modules ./node_modules

RUN mkdir -p /app/.tmp

EXPOSE 3000
ENTRYPOINT ["yarn", "start"]

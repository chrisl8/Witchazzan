FROM node:26

WORKDIR /app
COPY --chmod=0755 . ./

RUN npm i -g vite \
    && npm install --quiet \
    && ./scripts/versionNumberUpdate.sh \
    && npm run build
CMD ["node", "server/server.js"]

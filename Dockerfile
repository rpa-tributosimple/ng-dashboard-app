FROM node:18 AS build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod



FROM nginx:alpine

COPY --from=build /usr/src/app/dist/ts-dashboard-app/browser /usr/share/nginx/html
COPY --from=build /usr/src/app/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80


# correr contenedor 
#docker run -d -p 8080:80 --name ts-dash ts.dash

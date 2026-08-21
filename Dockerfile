# Stage 1: Build the Angular application
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# We move the build output to a standard folder so COPY doesn't fail based on Angular version
RUN [ -d "/app/dist/corner-ecommerce/browser" ] && cp -r /app/dist/corner-ecommerce/browser /app/dist-out || cp -r /app/dist/corner-ecommerce /app/dist-out

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
COPY --from=build /app/dist-out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

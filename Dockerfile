FROM node:20-alpine AS builder

WORKDIR /app

COPY smth-shared ./smth-shared
WORKDIR /app/smth-shared
RUN npm ci --ignore-scripts
RUN npm run build

WORKDIR /app
COPY smth-front/package*.json ./smth-front/
WORKDIR /app/smth-front
RUN npm ci
COPY smth-front ./

ARG VITE_API_BASE_URL=http://localhost:3000/api
ARG VITE_S3_IMAGE_PREPARE_PATH=
ARG VITE_S3_IMAGE_CONFIRM_PATH=
ARG VITE_S3_PUBLIC_BASE_URL=

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_S3_IMAGE_PREPARE_PATH=$VITE_S3_IMAGE_PREPARE_PATH
ENV VITE_S3_IMAGE_CONFIRM_PATH=$VITE_S3_IMAGE_CONFIRM_PATH
ENV VITE_S3_PUBLIC_BASE_URL=$VITE_S3_PUBLIC_BASE_URL

ENV NODE_OPTIONS="--max-old-space-size=3072"
RUN npm run build

FROM nginx:1.27-alpine

COPY smth-front/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/smth-front/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

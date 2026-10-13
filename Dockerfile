# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.13.0

FROM node:${NODE_VERSION}-slim AS build

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN npm ci --prefix backend

# Install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN npm ci --prefix frontend

# Copy application source
COPY backend ./backend
COPY frontend ./frontend
COPY package.json ./

# Build the React frontend
RUN npm run build

# Production image
FROM node:${NODE_VERSION}-slim AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy backend and its installed dependencies
COPY --from=build /app/backend ./backend

# Copy the built frontend
COPY --from=build /app/frontend/dist ./frontend/dist

# Copy root package.json for the start command
COPY package.json ./

EXPOSE 3003

CMD ["npm", "start"]
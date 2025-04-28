# Use official Nginx image
FROM nginx:alpine

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static files (index.html, style.css, etc.)
COPY . /usr/share/nginx/html

# Expose port 80 (default HTTP port)
EXPOSE 80

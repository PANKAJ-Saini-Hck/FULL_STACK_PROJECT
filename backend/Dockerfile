# Use a lightweight Node.js image
FROM node:20-slim

# Install system dependencies and CTF tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    g++ \
    steghide \
    libimage-exiftool-perl \
    binutils \
    binwalk \
    ffmpeg \
    hashcat \
    john \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Gobuster (needs Go, or we download the binary)
RUN curl -L https://github.com/OJ/gobuster/releases/download/v3.6.0/gobuster_Linux_x86_64.tar.gz | tar -xz -C /usr/local/bin

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Ensure the uploads directory exists
RUN mkdir -p uploads

# Expose the port the app runs on
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the application
CMD ["node", "server.js"]

#!/bin/bash

# Define the directories containing package.json
dirs=(
  "./microservices/core/config"
  "./microservices/core/lib"
  "./microservices/core/utils"
  "./microservices/core/server"
  "./microservices/core/schemas"
  "./microservices/user-service"
  "./microservices/admin-service"
  "./microservices/blog-service"
  "./microservices/event-bus-service"
)

# Loop through each directory and install dependencies
for dir in "${dirs[@]}"; do
  echo "Installing dependencies for $dir"
  cd $dir
  rm -rf node_modules package-lock.json
  npm install --save
  cd - > /dev/null
done

echo "All dependencies have been installed."
#!/bin/bash

# Directories for npm install
directories=(
    "./services/user-service"
    "./services/order-service"
    "./services/product-service"
    "./graphql-api-gateway"
)

# Run npm install in each directory
for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        if [ -f "$dir/package.json" ]; then
            echo "Running npm install in $dir"
            (cd "$dir" && npm install)
        else
            echo "No package.json found in $dir"
        fi
    else
        echo "Directory $dir does not exist"
    fi
done

# Create logs folder if it doesn't exist
mkdir -p logs

# Build and run docker-compose in detached mode
echo "Building and running docker-compose in detached mode..."
docker-compose up --build -d

# Remove old log files
rm -f logs/*.log
echo "Old log files cleared."

# Capture logs for each service
for service in $(docker-compose ps --services); do
    logfile="logs/${service}.log"
    docker-compose logs -f "$service" >> "$logfile" 2>&1 &
done

echo
echo "Saving live logs for each service in /logs folder"
echo

# Wait for containers to start
echo "Waiting for all containers to be fully started..."
sleep 5  

echo -e "\nDocker containers are up and running. Logs are in the logs/ folder."

# Show service URLs
echo -e "\nHere are the URLs for the services:\n"
echo "Services :-"
echo "- User-DB:          http://localhost:8081"
echo "- Product-DB:       http://localhost:8082"
echo "- Orders-DB:        http://localhost:8083"
echo "- Grafana:          http://localhost:3000"
echo "- Prometheus:       http://localhost:9090"
echo "- GraphQL-Gateway:  http://localhost:4000/graphql"
echo "- RabbitMQ:         http://localhost:15672"
echo
echo "To stop all services, run: docker-compose down"

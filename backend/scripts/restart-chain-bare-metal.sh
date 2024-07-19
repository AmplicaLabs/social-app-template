#!/bin/bash

# Stop and remove containers, networks
echo "Stopping and optionally removing containers, networks..."
docker compose down
    cat << EOI

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Do you want to remove the docker volumes [y/n]:                                             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

EOI
    read REMOVE_VOLUMES

    if [[ $REMOVE_VOLUMES =~ ^[Yy]$ ]]
    then
        # Remove specified volumes to remove all state and start fresh
        echo "Removing specified volumes..."
        docker volume rm backend_redis_data
        docker volume rm backend_chainstorage
        docker volume rm backend_ipfs_data
        docker volume rm backend_node_cache

        # Start specific services in detached mode
        echo "Starting frequency services..."
        docker compose -f docker-compose-bare-metal.yaml up -d frequency

        # Wait for 15 seconds
        echo "Waiting 15 seconds for Frequency to be ready..."
        sleep 15

        # Run npm run local:init 
        echo "Running npm run local:init to provision Provider with capacity, etc..."
        npm run local:init
    fi

# Start all services in detached mode
echo "Starting all services..."
docker compose -f docker-compose-bare-metal.yaml up -d

#!/bin/sh

# Strict error handling
set -e

# Check if we have enough arguments
if [ "$#" -lt 2 ]; then
    echo "Usage: $0 host port [-- command args]"
    exit 1
fi

# Store host and port
HOST="$1"
PORT="$2"

# Remove the first two arguments
shift 2

echo "Testing connection to $HOST:$PORT"

# Wait for the host and port to be available
until nc -z "$HOST" "$PORT"; do
    echo "Waiting for $HOST:$PORT..."
    sleep 1
done

echo "$HOST:$PORT is available"

# If there are remaining arguments, execute them
if [ $# -gt 0 ]; then
    exec "$@"
fi

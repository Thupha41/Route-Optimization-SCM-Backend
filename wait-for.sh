#!/bin/sh

# wait-for.sh
# Wait until the given host and port are ready.

host="$1"
shift
port="$1"
shift

until nc -z "$host" "$port"; do
  >&2 echo "Waiting for $host:$port..."
  sleep 1
done

>&2 echo "$host:$port is up"
exec "$@"

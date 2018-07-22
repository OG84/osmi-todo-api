#!/bin/bash

# Start the first process
node /usr/app/server.js -D
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start api: $status"
  exit $status
fi

sleep 5000

# Start the second process
/var/lib/neo4j/bin/neo4j start -D
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start neo4j: $status"
  exit $status
fi

# Naive check runs checks once a minute to see if either of the processes exited.
# This illustrates part of the heavy lifting you need to do if you want to run
# more than one service in a container. The container exits with an error
# if it detects that either of the processes has exited.
# Otherwise it loops forever, waking up every 60 seconds


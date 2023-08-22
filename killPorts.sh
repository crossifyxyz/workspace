#!/bin/bash

# Prompt the user for ports
echo "Enter ports to kill in the format: 8080,5000"
read ports

# Convert commas to spaces
ports=$(echo $ports | tr ',' ' ')

# Loop through each port and kill it
for port in $ports; do
    fuser -k $port/tcp
done

echo "Finished killing ports."

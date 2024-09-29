#!/bin/bash

# Initialize the database
npx ts-node src/utils/db/init_db.ts

# Start the backend server
npm run start

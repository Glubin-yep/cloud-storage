[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# SkyKeep Backend Server

This repository contains the backend server code for Project SkyKeep, an advanced cloud storage solution designed to meet people's personal needs.

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **Authentication**: GitHub OAuth 2.0
- **ORM**: TypeORM
- **File Uploads**: Multer

## Getting Started

To get a local copy up and running, follow these steps:

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Glubin-yep/cloud-storage.git
   ```
2. Install dependencies:
    ```bash
     npm install
    ```
3. Set up environment variables:   
Create a .env file in the root directory and provide the following variables:
   ```bash
    PORT=
    SECRET_KEY = 
    EXPIRES_IN = 
    DB_HOST= 
    DB_PORT=
    DB_USER=
    DB_PASSWORD=
    DB_NAME=

    GITHUB_CLIENT_ID = 
    GITHUB_CLIENT_SECRET = 
    GITHUB_CALLBACK_URL = 
    FRONTEND_URL = 
   ```
4. Run the server:
   ```bash
   npm run start:dev
   ```

## Link

FrontEnd repo: [https://github.com/Glubin-yep/SkyKeep](https://github.com/Glubin-yep/SkyKeep)


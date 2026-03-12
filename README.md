# CST8911 Midterm Project — Serverless Azure API

**Course:** CST8911-300 Introduction to Cloud Computing  
**College:** Algonquin College | Winter 2026  
**Student:** Divyang Lodariya  

## Project Overview

A secure, serverless RESTful API built on Microsoft Azure following 
enterprise security best practices. Zero hardcoded secrets.

## Architecture
```
[Azure VM] → SSH → [Developer]
                        |
                   curl (HTTPS)
                        |
              [Azure Function App]
               /                \
    [Azure Key Vault]    [Azure Cosmos DB]
    (Connection String)   (MidtermDB/Items)
```

## Azure Services Used

| Service | Purpose |
|---------|---------|
| Azure Function App | Serverless API hosting (Node.js 22 LTS) |
| Azure Cosmos DB | NoSQL database (Serverless mode) |
| Azure Key Vault | Secret management (connection string) |
| Azure Virtual Machine | Testing hub (Ubuntu 24.04) |

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/items | Create item |
| GET | /api/items/{id} | Get item by ID |
| DELETE | /api/items/{id} | Delete item |
| GET | /api/items | List all items |

## Security Features

- System-Assigned Managed Identity for passwordless Key Vault access
- No hardcoded secrets anywhere in code
- Function Access Keys for API authentication
- Least-privilege RBAC roles throughout
```



Once all files are uploaded, copy your repo URL:
```
https://github.com/YOUR-USERNAME/cst8911-midterm-azure

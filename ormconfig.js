module.exports = [
    {
        "type": "postgres",
        "url": process.env.DATABASE_URL,
        "synchronize": true,
        "logging": true,
        "migrations": [
            "./src/database/migration/**.ts"
        ],
        "entities": [
            "./src/models/**.ts"
        ],
        "cli": {
            "migrationsDir": "./src/database/migration"
        }
    },
    {
        "name": "test",
        "type": "postgres",
        "url": "postgres://test:test@localhost:5432/test",
        "synchronize": false,
        "dropSchema": true,
        "logging": false,
        "migrations": [
            "./src/database/migration/**.ts"
        ],
        "entities": [
            "./src/models/**.ts"
        ]
    },
    {
        "name": "start",
        "type": "postgres",
        "url": process.env.DATABASE_URL,
        "synchronize": true,
        "logging": true,
        "migrations": [
            "build/src/database/migration/**.js"
        ],
        "entities": [
            "build/src/models/**.js"
        ],
        "cli": {
            "migrationsDir": "./src/database/migration",
            "entitiesDir": "./src/models"
        }
    }
]
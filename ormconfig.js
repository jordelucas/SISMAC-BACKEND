module.exports = [
    {
        "name": process.env.ENV_LOCAL,
        "type": "postgres",
        "url": process.env.DATABASE_URL,
        "synchronize": false,
        "logging": true,
        "logger": "file",
        "migrations": [
            process.env.MIGRATIONS_PATH
        ],
        "entities": [
            process.env.ENTITIES_PATH
        ],
        "cli": {
            "migrationsDir": "./src/database/migration",
            "entitiesDir": "./src/models"
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
    }
]
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
        "name": "postgres",
        "type": "postgres",
        "url": "postgres://postgres:postgres@localhost:5432/postgres",
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
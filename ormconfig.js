module.exports = [
    {
        "type": "postgres",
        "url": "postgres://test:test@localhost:5432/database",
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
    }
]
export const getConfiguration = () =>
    (
        {
            database: {
                MONGOURI: process.env.MONGOURI
            },
            application: {
                port: process.env.PORT ?? 8081,
                cors: {
                    origin: process.env.CORS_ALLOWED_ORIGINS ?? [],
                    methods: 'GET,PUT,PATCH,POST,DELETE',
                },
            },
        }
    ) as const;

export type ConfigurationType = ReturnType<typeof getConfiguration>;
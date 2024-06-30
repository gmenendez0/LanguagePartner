const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = [
    './routes/routes.ts',
    './routes/languageRoutes.ts',
    './routes/userRoutes.ts',
    './routes/sessionRoutes.ts'
]

swaggerAutogen(outputFile, endpointsFiles)
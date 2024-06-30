import cors from 'cors';

const whitelist: string[] = [
    'http://localhost:8081',
    'http://localhost',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

const corsConfigured = cors(corsOptions);
export default corsConfigured;
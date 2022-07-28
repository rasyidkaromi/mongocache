import express, { Application } from 'express';
import { json } from 'body-parser';
import { routes } from './routeservices';
require('dotenv').config();

export const app: Application = express();
const PORT = process.env.PORT;
app.use(json());

// Application routing
routes(app);

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});




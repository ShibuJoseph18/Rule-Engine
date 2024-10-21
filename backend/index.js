import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fetchRules from './routes/fetchRules.route.js';
import createRuleRoute from './routes/createRule.route.js';
import evaluateInputRoute from './routes/evaluateInput.route.js';
import combineAstsRoute from './routes/combineAsts.route.js'; 
import modifyRuleRoute from './routes/modifyRule.route.js';   
import errorHandler from './middleware/errorHandler.js';
import sequelize from './config/database.js'; // Import the sequelize instance


dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', createRuleRoute);
app.use('/api', evaluateInputRoute);
app.use('/api', combineAstsRoute); 
app.use('/api', modifyRuleRoute); 
app.use('/api', fetchRules); 

// Error handling middleware
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {

    // Test database connection
    sequelize.authenticate()
    .then(() => {
        console.log('Database connected');
        // Synchronize models with the database
        return sequelize.sync();  // Automatically create tables based on models
    })
    .then(() => {
        console.log('Models synchronized');
    })
    .catch(err => console.error('Database connection error:', err));

    // Basic test route
    app.get('/', (req, res) => {
        res.send('Rule Engine API is running...');
    });
    // Start the server only if it's not in the test environment
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
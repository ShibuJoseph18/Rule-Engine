import express from 'express';
import { evaluateInput } from '../api/evaluateInput.api.js';

const router = express.Router();

// POST route to evaluate the user input against the rule in db
router.post('/evaluateInput', evaluateInput);

export default router;

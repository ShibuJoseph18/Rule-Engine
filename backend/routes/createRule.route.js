import express from 'express';
import { createRule } from '../api/createRule.api.js';

const router = express.Router();

// POST route to add a rule and transform it
router.post('/createRule', createRule);

export default router;

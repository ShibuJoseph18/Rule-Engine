import express from 'express';
import { combineRules } from '../api/combineAsts.api.js';

const router = express.Router();

// POST route to add a rule and transform it
router.post('/combineAsts', combineRules);

export default router;

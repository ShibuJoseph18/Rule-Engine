import express from 'express';
import { modifyRule } from '../api/modifyRule.api.js';

const router = express.Router();

// PUT route to modify an existing rule by ID
router.put('/modifyRuleById/:id', modifyRule);

export default router;

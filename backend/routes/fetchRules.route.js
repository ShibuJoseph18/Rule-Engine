import express from 'express';
import { fetchAllRules, fetchRuleById } from '../api/fetchRules.api.js';


const router = express.Router();

// POST route to add a rule and transform it
router.get('/fetchAllRules', fetchAllRules);

router.get('/fetchRuleById/:id', fetchRuleById);

export default router;

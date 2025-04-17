const express = require('express');
const router = express.Router();
const templateController = require('../controllers/proposalTemplateController');

router.get('/', templateController.getAllTemplates);
router.get('/seed', templateController.seedTemplates);
router.get('/:id', templateController.getTemplateById);
router.post('/', templateController.createTemplate);

module.exports = router;


import { Router } from 'express';
import {
  createApplication,
  getOrganizationApplications,
  getMyApplications,
  updateApplicationStatus,
  deleteApplication,
  getOrganisationContact,
} from '../controllers/applicationController';
import authenticate from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { applicationParamsSchema } from '../schemas/userSchemas';

const router = Router();

router.post('/', authenticate, createApplication);
router.get('/organization', authenticate, getOrganizationApplications);
router.patch('/:id/status', authenticate, updateApplicationStatus);
router.delete('/:id', authenticate, deleteApplication);
router.get('/', authenticate, getMyApplications);
router.get('/me', authenticate, getMyApplications);
router.get('/:id/organisation-contact', authenticate, getOrganisationContact);
router.get(
  '/:id/organisation-contact',
  authenticate,
  validateRequest({ params: applicationParamsSchema }),
  getOrganisationContact,
);

export default router;

import { z } from 'zod';
import { SaveCompanySchema } from '@shared/validators/company.schemes';

export type SaveCompanyType = z.infer<typeof SaveCompanySchema>;

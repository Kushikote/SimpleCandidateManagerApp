import express, { Request, Response } from 'express';
import cors from 'cors';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import type { Candidate, CandidateBase } from './types';

const app = express();
const PORT = 8000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Simple request logger to mirror Python-style logs in the terminal
app.use((req, _res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl} - ${req.ip}`);
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    try {
      console.log('Request body:', JSON.stringify(req.body));
    } catch (e) {
      console.log('Request body: <unserializable>');
    }
  }
  next();
});

const candidateSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: 'name is required' })
    .max(100, { message: 'name must be 100 characters or less' }),
  phone: z.string()
    .transform((value) => value.replace(/\D/g, ''))
    .refine((value) => value.length === 10, { message: 'phone must be exactly 10 digits' }),
  skills: z.array(z.string())
    .transform((skills) => Array.from(new Set(skills.map((skill) => skill.trim()).filter(Boolean))))
    .refine((skills) => skills.length > 0, { message: 'at least one skill is required' }),
  experience_years: z.number({ invalid_type_error: 'experience_years must be a number' })
    .int({ message: 'experience_years must be an integer' })
    .nonnegative({ message: 'experience_years must be 0 or greater' }),
  status: z.enum(['active', 'inactive'])
});


const candidates: Candidate[] = [];

function formatZodError(error: z.ZodError) {
  return error.errors.map((issue) => {
    const path = issue.path.length ? issue.path.join('.') : 'body';
    return `${path}: ${issue.message}`;
  }).join(', ');
}

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Candidate API is running' });
});

app.get('/candidates', (_req: Request, res: Response) => {
  console.log(`Returning ${candidates.length} candidates`);
  res.json(candidates);
});

app.post('/candidates', (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    experience_years: Number(req.body?.experience_years)
  };

  const parseResult = candidateSchema.safeParse(payload);
  if (!parseResult.success) {
    const detail = formatZodError(parseResult.error);
    console.log('Validation failed:', detail);
    return res.status(400).json({ detail });
  }

  const candidateData: CandidateBase = parseResult.data;
  const candidate: Candidate = {
    id: randomUUID(),
    ...candidateData
  };

  candidates.push(candidate);
  console.log('Candidate created:', candidate.id, candidate.name);
  return res.status(201).json(candidate);
});

app.get('/candidates/:candidateId', (req: Request, res: Response) => {
  const candidate = candidates.find((item) => item.id === req.params.candidateId);
  if (!candidate) {
    return res.status(404).json({ detail: 'Candidate not found' });
  }
  return res.json(candidate);
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://127.0.0.1:${PORT}`);
});

export type CandidateStatus = 'active' | 'inactive';

export interface CandidateBase {
  name: string;
  phone: string;
  skills: string[];
  experience_years: number;
  status: CandidateStatus;
}

export interface Candidate extends CandidateBase {
  id: string;
}

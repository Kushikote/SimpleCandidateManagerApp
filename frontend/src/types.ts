export interface Candidate {
  id: string;
  name: string;
  phone: string;
  skills: string[];
  experience_years: number;
  status: "active" | "inactive";
}
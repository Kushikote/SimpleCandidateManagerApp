import React, { useState } from 'react';
import { Candidate } from '../types';
import './CreateCandidate.css';

interface CreateCandidateProps {
  onBack: () => void;
  onAdd: (candidate: Omit<Candidate, 'id'>) => void;
  onError?: (error: string) => void;
}

const CreateCandidate: React.FC<CreateCandidateProps> = ({ onBack, onAdd, onError }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    experience_years: '',
    status: 'active' as 'active' | 'inactive'
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const normalizedPhone = formData.phone.replace(/\D/g, '');
    const experienceYears = Number(formData.experience_years);

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (normalizedPhone.length !== 10) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }
    if (skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }
    if (!formData.experience_years.trim()) {
      newErrors.experience_years = 'Experience is required';
    } else if (Number.isNaN(experienceYears) || !Number.isInteger(experienceYears) || experienceYears < 0) {
      newErrors.experience_years = 'Experience must be a whole number 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const normalizedPhone = formData.phone.replace(/\D/g, '');
      const experienceYears = Number(formData.experience_years);
      const candidateData: Omit<Candidate, 'id'> = {
        name: formData.name.trim(),
        phone: normalizedPhone,
        skills,
        experience_years: experienceYears,
        status: formData.status
      };
      await onAdd(candidateData);
      setFormData({ name: '', phone: '', experience_years: '', status: 'active' });
      setSkills([]);
      setSkillInput('');
      setErrors({});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create candidate';
      setErrors({ submit: errorMessage });
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (!trimmedSkill) {
      setErrors(prev => ({ ...prev, skillInput: 'Skill cannot be empty' }));
      return;
    }
    if (skills.includes(trimmedSkill)) {
      setErrors(prev => ({ ...prev, skillInput: 'This skill is already added' }));
      return;
    }
    setSkills([...skills, trimmedSkill]);
    setSkillInput('');
    if (errors.skills) {
      setErrors(prev => ({ ...prev, skills: '' }));
    }
    if (errors.skillInput) {
      setErrors(prev => ({ ...prev, skillInput: '' }));
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="create-candidate-container">
      <button className="back-btn" onClick={onBack}>← Back to List</button>
      <h1>Create Candidate</h1>
      <form className="create-form" onSubmit={handleSubmit}>
        {errors.submit && <div className="form-error-message">{errors.submit}</div>}
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number (10 digits)</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="1234567890"
            maxLength={10}
            className={errors.phone ? 'input-error' : ''}
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="skills">Skills</label>
          <div className="skill-input-group">
            <input
              id="skills"
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={handleSkillKeyPress}
              placeholder="Enter a skill"
              className={errors.skillInput ? 'input-error' : ''}
            />
            <button type="button" onClick={handleAddSkill} className="add-skill-btn">
              Add Skill
            </button>
          </div>
          {errors.skillInput && <span className="field-error">{errors.skillInput}</span>}
          {errors.skills && <span className="field-error">{errors.skills}</span>}
          {skills.length > 0 && (
            <div className="skills-list">
              {skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="remove-skill-btn"
                    aria-label={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="experience_years">Experience (Years)</label>
          <input
            id="experience_years"
            name="experience_years"
            type="number"
            value={formData.experience_years}
            onChange={handleChange}
            placeholder="Enter years of experience"
            min="0"
            className={errors.experience_years ? 'input-error' : ''}
          />
          {errors.experience_years && <span className="field-error">{errors.experience_years}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button className="submit-btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Candidate'}
        </button>
      </form>
    </div>
  );
};

export default CreateCandidate;
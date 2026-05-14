import React from 'react';
import { Candidate } from '../types';
import './CandidateList.css';

interface CandidateListProps {
  candidates: Candidate[];
  onCreateClick: () => void;
  isLoading?: boolean;
}

const CandidateList: React.FC<CandidateListProps> = ({ candidates, onCreateClick, isLoading }) => {
  return (
    <div className="candidate-list-container">
      <h1>Candidate Management</h1>
      <button className="add-candidate-btn" onClick={onCreateClick}>
        + Add New Candidate
      </button>
      <h2>Candidates</h2>
      {isLoading ? (
        <div className="empty-state">Loading candidates...</div>
      ) : candidates.length === 0 ? (
        <div className="empty-state">No candidates yet. Click "Add New Candidate" to create one.</div>
      ) : (
        <ul className="candidates-list">
          {candidates.map(candidate => (
            <li key={candidate.id} className="candidate-card">
              <div className="candidate-card-name">{candidate.name}</div>
              <div className="candidate-card-info">
                <span className="candidate-card-label">Phone:</span> {candidate.phone}
              </div>
              <div className="candidate-card-info">
                <span className="candidate-card-label">Skills:</span> {candidate.skills.join(', ')}
              </div>
              <div className="candidate-card-info">
                <span className="candidate-card-label">Experience:</span> {candidate.experience_years} years
              </div>
              <div className="candidate-card-info">
                <span className="candidate-card-label">Status:</span>{' '}
                <span style={{ color: candidate.status === 'active' ? '#4CAF50' : '#f44336' }}>
                  {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CandidateList;
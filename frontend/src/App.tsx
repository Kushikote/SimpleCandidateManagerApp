import React, { useState, useEffect } from 'react';
import CandidateList from './components/CandidateList';
import CreateCandidate from './components/CreateCandidate';
import { Candidate } from './types';
import './App.css';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [screen, setScreen] = useState<'list' | 'create'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/candidates`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      const data = await response.json();
      setCandidates(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch candidates';
      setError(errorMessage);
      console.error('Error fetching candidates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (candidateData: Omit<Candidate, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateData)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.detail || 'Failed to create candidate';
        throw new Error(message);
      }
      await fetchCandidates();
      setScreen('list');
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create candidate';
      setError(errorMessage);
      console.error('Error creating candidate:', err);
      throw err;
    }
  };

  if (screen === 'list') {
    return (
      <>
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '16px',
            maxWidth: '900px',
            margin: '16px auto 16px'
          }}>
            {error}
            <button onClick={() => setError(null)} style={{ float: 'right', background: 'none', border: 'none', color: '#721c24', cursor: 'pointer' }}>×</button>
          </div>
        )}
        <CandidateList candidates={candidates} onCreateClick={() => setScreen('create')} isLoading={isLoading} />
      </>
    );
  } else {
    return <CreateCandidate onBack={() => setScreen('list')} onAdd={handleAdd} onError={setError} />;
  }
}

export default App;

import { Case } from '@/components/cases/CaseTypes';

export const getAllCases = async (): Promise<Case[]> => {
  const cases = JSON.parse(localStorage.getItem('cases') || '[]');
  return cases;
};

export const getCaseById = async (id: string): Promise<Case | null> => {
  const cases = JSON.parse(localStorage.getItem('cases') || '[]');
  return cases.find((c: Case) => c.id === id) || null;
};

export const createCase = async (newCase: Partial<Case>): Promise<Case> => {
  const cases = JSON.parse(localStorage.getItem('cases') || '[]');
  const caseToCreate = {
    ...newCase,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  cases.push(caseToCreate);
  localStorage.setItem('cases', JSON.stringify(cases));
  return caseToCreate;
};

export const updateCase = async (id: string, updates: Partial<Case>): Promise<Case> => {
  const cases = JSON.parse(localStorage.getItem('cases') || '[]');
  const index = cases.findIndex((c: Case) => c.id === id);
  if (index === -1) {
    throw new Error('Case not found');
  }
  cases[index] = { ...cases[index], ...updates };
  localStorage.setItem('cases', JSON.stringify(cases));
  return cases[index];
};

export const deleteCase = async (id: string): Promise<boolean> => {
  const cases = JSON.parse(localStorage.getItem('cases') || '[]');
  const filtered = cases.filter((c: Case) => c.id !== id);
  localStorage.setItem('cases', JSON.stringify(filtered));
  return true;
};

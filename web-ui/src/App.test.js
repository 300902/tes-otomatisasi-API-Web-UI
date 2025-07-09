import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} }))
}));

describe('App Component', () => {
  test('renders main heading', () => {
    render(<App />);
    const heading = screen.getByText('Automation Web UI');
    expect(heading).toBeInTheDocument();
  });

  test('renders API health status section', () => {
    render(<App />);
    const healthSection = screen.getByText('API Health Status');
    expect(healthSection).toBeInTheDocument();
  });

  test('renders add user form', () => {
    render(<App />);
    const addUserSection = screen.getByText('Add New User');
    expect(addUserSection).toBeInTheDocument();
  });

  test('renders users section', () => {
    render(<App />);
    const usersSection = screen.getByText('Users');
    expect(usersSection).toBeInTheDocument();
  });
});

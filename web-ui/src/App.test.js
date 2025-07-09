import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock axios
jest.mock('axios');

describe('App Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

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
    
    const nameInput = screen.getByLabelText('Name:');
    const emailInput = screen.getByLabelText('Email:');
    const addButton = screen.getByRole('button', { name: 'Add User' });
    
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });

  test('renders users section', () => {
    render(<App />);
    const usersSection = screen.getByText('Users');
    expect(usersSection).toBeInTheDocument();
  });

  test('can input user data in form', () => {
    render(<App />);
    
    const nameInput = screen.getByLabelText('Name:');
    const emailInput = screen.getByLabelText('Email:');
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(nameInput.value).toBe('Test User');
    expect(emailInput.value).toBe('test@example.com');
  });

  test('shows refresh buttons', () => {
    render(<App />);
    
    const refreshStatusButton = screen.getByText('Refresh Status');
    const refreshUsersButton = screen.getByText(/Refresh Users|Loading.../);
    
    expect(refreshStatusButton).toBeInTheDocument();
    expect(refreshUsersButton).toBeInTheDocument();
  });
});

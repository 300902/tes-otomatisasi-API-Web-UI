import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} }))
}));
//test changes for commit
describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    test('renders main heading', async () => {
      await act(async () => {
        render(<App />);
      });
      const heading = screen.getByText('Automation Web UI');
      expect(heading).toBeInTheDocument();
    });

    test('shows login form when not logged in', async () => {
      await act(async () => {
        render(<App />);
      });
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByTestId('username-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });

    test('shows demo credentials', () => {
      render(<App />);
      expect(screen.getByText('Demo Credentials:')).toBeInTheDocument();
      expect(screen.getByText('Username: admin')).toBeInTheDocument();
      expect(screen.getByText('Password: password123')).toBeInTheDocument();
    });

    test('does not show dashboard content when not logged in', () => {
      render(<App />);
      expect(screen.queryByText('API Health Status')).not.toBeInTheDocument();
      expect(screen.queryByText('Add New User')).not.toBeInTheDocument();
      expect(screen.queryByText('Users')).not.toBeInTheDocument();
    });
  });

  describe('Login Functionality', () => {
    test('successful login with correct credentials', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Fill in login form
      await user.type(screen.getByTestId('username-input'), 'admin');
      await user.type(screen.getByTestId('password-input'), 'password123');

      // Submit form
      await user.click(screen.getByTestId('login-button'));

      // Check that dashboard content is now visible
      await waitFor(() => {
        expect(screen.getByText('API Health Status')).toBeInTheDocument();
        expect(screen.getByText('Add New User')).toBeInTheDocument();
        expect(screen.getByText('Users')).toBeInTheDocument();
      });

      // Check that login form is no longer visible
      expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();

      // Check that logout button is visible
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    test('failed login with incorrect username', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Fill in login form with wrong username
      await user.type(screen.getByTestId('username-input'), 'wronguser');
      await user.type(screen.getByTestId('password-input'), 'password123');

      // Submit form
      await user.click(screen.getByTestId('login-button'));

      // Check that error message is displayed
      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toBeInTheDocument();
        expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
      });

      // Check that dashboard content is still not visible
      expect(screen.queryByText('API Health Status')).not.toBeInTheDocument();
    });

    test('failed login with incorrect password', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Fill in login form with wrong password
      await user.type(screen.getByTestId('username-input'), 'admin');
      await user.type(screen.getByTestId('password-input'), 'wrongpassword');

      // Submit form
      await user.click(screen.getByTestId('login-button'));

      // Check that error message is displayed
      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toBeInTheDocument();
        expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
      });
    });

    test('failed login with empty credentials', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Try to submit form without filling fields
      await user.click(screen.getByTestId('login-button'));

      // HTML5 validation should prevent submission
      // Check that we're still on login form
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
      expect(screen.queryByText('API Health Status')).not.toBeInTheDocument();
    });

    test('form inputs are controlled components', async () => {
      const user = userEvent.setup();
      render(<App />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');

      // Type in inputs
      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'testpass');

      // Check that values are set
      expect(usernameInput.value).toBe('testuser');
      expect(passwordInput.value).toBe('testpass');
    });
  });

  describe('Logout Functionality', () => {
    test('logout returns to login screen', async () => {
      const user = userEvent.setup();
      render(<App />);

      // First login
      await user.type(screen.getByTestId('username-input'), 'admin');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('login-button'));

      // Wait for dashboard to load
      await waitFor(() => {
        expect(screen.getByText('API Health Status')).toBeInTheDocument();
      });

      // Click logout
      await user.click(screen.getByText('Logout'));

      // Check that login form is back
      await waitFor(() => {
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
      });

      // Check that dashboard content is hidden
      expect(screen.queryByText('API Health Status')).not.toBeInTheDocument();
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });

    test('logout clears form fields and errors', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Try wrong credentials first to get an error
      await user.type(screen.getByTestId('username-input'), 'wrong');
      await user.type(screen.getByTestId('password-input'), 'wrong');
      await user.click(screen.getByTestId('login-button'));

      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toBeInTheDocument();
      });

      // Now login correctly
      await user.clear(screen.getByTestId('username-input'));
      await user.clear(screen.getByTestId('password-input'));
      await user.type(screen.getByTestId('username-input'), 'admin');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('login-button'));

      await waitFor(() => {
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });

      // Logout
      await user.click(screen.getByText('Logout'));

      await waitFor(() => {
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
      });

      // Check that form fields are cleared and no error is shown
      expect(screen.getByTestId('username-input').value).toBe('');
      expect(screen.getByTestId('password-input').value).toBe('');
      expect(screen.queryByTestId('login-error')).not.toBeInTheDocument();
    });
  });

  describe('Dashboard Access Control', () => {
    test('dashboard content is only accessible after login', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Initially no dashboard content
      expect(screen.queryByText('API Health Status')).not.toBeInTheDocument();
      expect(screen.queryByText('Add New User')).not.toBeInTheDocument();
      expect(screen.queryByText('Users')).not.toBeInTheDocument();

      // Login
      await user.type(screen.getByTestId('username-input'), 'admin');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('login-button'));

      // Now dashboard content should be visible
      await waitFor(() => {
        expect(screen.getByText('API Health Status')).toBeInTheDocument();
        expect(screen.getByText('Add New User')).toBeInTheDocument();
        expect(screen.getByText('Users')).toBeInTheDocument();
      });
    });
  });
});

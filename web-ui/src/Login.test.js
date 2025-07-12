import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} }))
}));

describe('Login Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Form Validation', () => {
    test('username field is required', async () => {
      const user = userEvent.setup();
      render(<App />);

      const usernameInput = screen.getByTestId('username-input');
      const submitButton = screen.getByTestId('login-button');

      // Try to submit without username
      await user.type(screen.getByTestId('password-input'), 'password123');
      
      expect(usernameInput).toHaveAttribute('required');
      expect(usernameInput.checkValidity()).toBe(false);
    });

    test('password field is required', async () => {
      const user = userEvent.setup();
      render(<App />);

      const passwordInput = screen.getByTestId('password-input');

      // Try to submit without password
      await user.type(screen.getByTestId('username-input'), 'admin');
      
      expect(passwordInput).toHaveAttribute('required');
      expect(passwordInput.checkValidity()).toBe(false);
    });

    test('password field masks input', () => {
      render(<App />);
      const passwordInput = screen.getByTestId('password-input');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Login Error Handling', () => {
    test('error message clears when typing new credentials', async () => {
      const user = userEvent.setup();
      render(<App />);

      // First, cause an error
      await user.type(screen.getByTestId('username-input'), 'wrong');
      await user.type(screen.getByTestId('password-input'), 'wrong');
      await user.click(screen.getByTestId('login-button'));

      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toBeInTheDocument();
      });

      // Start typing new credentials - error should clear
      await user.clear(screen.getByTestId('username-input'));
      await user.type(screen.getByTestId('username-input'), 'a');

      // Error should be gone since we've implemented clearing on input change
      await waitFor(() => {
        expect(screen.queryByTestId('login-error')).not.toBeInTheDocument();
      });
    });

    test('multiple failed login attempts show error each time', async () => {
      const user = userEvent.setup();
      render(<App />);

      // First failed attempt
      await user.type(screen.getByTestId('username-input'), 'wrong1');
      await user.type(screen.getByTestId('password-input'), 'wrong1');
      await user.click(screen.getByTestId('login-button'));

      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toBeInTheDocument();
      });

      // Second failed attempt
      await user.clear(screen.getByTestId('username-input'));
      await user.clear(screen.getByTestId('password-input'));
      await user.type(screen.getByTestId('username-input'), 'wrong2');
      await user.type(screen.getByTestId('password-input'), 'wrong2');
      await user.click(screen.getByTestId('login-button'));

      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toBeInTheDocument();
        expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
      });
    });
  });

  describe('Login Success Scenarios', () => {
    test('successful login hides login form and shows dashboard', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.type(screen.getByTestId('username-input'), 'admin');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('login-button'));

      await waitFor(() => {
        expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
        expect(screen.getByText('API Health Status')).toBeInTheDocument();
      });
    });

    test('login form clears after successful login', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Login successfully
      await user.type(screen.getByTestId('username-input'), 'admin');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('login-button'));

      await waitFor(() => {
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });

      // Logout to go back to login form
      await user.click(screen.getByText('Logout'));

      await waitFor(() => {
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
      });

      // Check that form fields are empty
      expect(screen.getByTestId('username-input').value).toBe('');
      expect(screen.getByTestId('password-input').value).toBe('');
    });
  });

  describe('Keyboard Navigation', () => {
    test('can navigate form with Tab key', async () => {
      const user = userEvent.setup();
      render(<App />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const loginButton = screen.getByTestId('login-button');

      // Start at username field
      usernameInput.focus();
      expect(document.activeElement).toBe(usernameInput);

      // Tab to password field
      await user.tab();
      expect(document.activeElement).toBe(passwordInput);

      // Tab to login button
      await user.tab();
      expect(document.activeElement).toBe(loginButton);
    });

    test('can submit form with Enter key', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.type(screen.getByTestId('username-input'), 'admin');
      await user.type(screen.getByTestId('password-input'), 'password123');
      
      // Press Enter to submit
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('API Health Status')).toBeInTheDocument();
      });
    });
  });

  describe('UI State Management', () => {
    test('login button has correct text', () => {
      render(<App />);
      const loginButton = screen.getByTestId('login-button');
      expect(loginButton).toHaveTextContent('Login');
    });

    test('demo credentials are displayed correctly', () => {
      render(<App />);
      expect(screen.getByText('Demo Credentials:')).toBeInTheDocument();
      expect(screen.getByText('Username: admin')).toBeInTheDocument();
      expect(screen.getByText('Password: password123')).toBeInTheDocument();
    });

    test('logout button appears after successful login', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Initially no logout button
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();

      // Login
      await user.type(screen.getByTestId('username-input'), 'admin');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('login-button'));

      // Logout button should appear
      await waitFor(() => {
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles whitespace in credentials', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Try login with whitespace
      await user.type(screen.getByTestId('username-input'), ' admin ');
      await user.type(screen.getByTestId('password-input'), ' password123 ');
      await user.click(screen.getByTestId('login-button'));

      // Should fail because of exact match requirement
      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toBeInTheDocument();
      });
    });

    test('handles case sensitivity', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Try login with different case
      await user.type(screen.getByTestId('username-input'), 'Admin');
      await user.type(screen.getByTestId('password-input'), 'Password123');
      await user.click(screen.getByTestId('login-button'));

      // Should fail because of case sensitivity
      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toBeInTheDocument();
      });
    });

    test('handles special characters in credentials', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Try login with special characters
      await user.type(screen.getByTestId('username-input'), 'admin@#$');
      await user.type(screen.getByTestId('password-input'), 'password123!@#');
      await user.click(screen.getByTestId('login-button'));

      // Should fail
      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toBeInTheDocument();
      });
    });
  });
});

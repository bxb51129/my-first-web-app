import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Navbar component', () => {
  render(<App />);
  const navElement = screen.getByText(/Home/i); // 检查 Navbar 中的 "Home"
  expect(navElement).toBeInTheDocument();
});

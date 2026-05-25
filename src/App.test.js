import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';

test('renders app title', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByText(/Quran Kareem/i)).toBeInTheDocument();
});

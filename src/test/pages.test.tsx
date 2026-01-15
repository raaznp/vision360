import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import Forbidden from '../pages/Forbidden';
import React from 'react';

// Wrapper for router context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Page Component Smoke Tests', () => {
  
  describe('NotFound Page', () => {
    it('should render 404 text correctly', () => {
      renderWithRouter(<NotFound />);
      expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
      expect(screen.getByText(/404/i)).toBeInTheDocument();
    });

    it('should render navigation buttons', () => {
        renderWithRouter(<NotFound />);
        expect(screen.getByText(/Back to Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Go Back/i)).toBeInTheDocument();
    });
  });

  describe('Forbidden Page', () => {
    it('should render Access Denied text correctly', () => {
      renderWithRouter(<Forbidden />);
      expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
      expect(screen.getByText(/403/i)).toBeInTheDocument();
    });

    it('should render navigation buttons', () => {
        renderWithRouter(<Forbidden />);
        expect(screen.getByText(/Back to Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Go Back/i)).toBeInTheDocument();
    });
  });
});

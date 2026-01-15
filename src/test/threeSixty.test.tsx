import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ThreeSixtyViewer from '@/components/ThreeSixtyViewer';
import React from 'react';

describe('ThreeSixtyViewer Component', () => {
    
    beforeEach(() => {
        // Mock global window object properties if needed
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
        document.head.innerHTML = '';
        delete window.pannellum;
    });

    it('should inject pannellum script and css style tag', () => {
        const { container } = render(<ThreeSixtyViewer imageUrl="test.jpg" />);
        
        // Check for script injection
        const scripts = document.body.getElementsByTagName('script');
        let foundScript = false;
        for(let i=0; i<scripts.length; i++) {
            if (scripts[i].src.includes('pannellum.js')) foundScript = true;
        }
        
        // Technically the component injects it into body, so we check that
        expect(foundScript).toBe(true);
        
        // Check css
        const links = document.head.getElementsByTagName('link');
        let foundLink = false;
        for(let i=0; i<links.length; i++) {
             if (links[i].href.includes('pannellum.css')) foundLink = true;
        }
        expect(foundLink).toBe(true);
    });

    it('should show loading state initially', () => {
        render(<ThreeSixtyViewer imageUrl="test.jpg" />);
        expect(screen.getByText('Loading 360 Viewer...')).toBeInTheDocument();
    });

});

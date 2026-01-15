import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Utility Functions', () => {
    describe('cn (Class Name Merger)', () => {
        it('should merge tailwind classes correctly', () => {
            const result = cn('text-red-500', 'bg-blue-500');
            expect(result).toContain('text-red-500');
            expect(result).toContain('bg-blue-500');
        });

        it('should handle conditional classes', () => {
            const condition = true;
            const result = cn('text-red-500', condition && 'bg-blue-500', !condition && 'p-4');
            expect(result).toContain('text-red-500');
            expect(result).toContain('bg-blue-500');
            expect(result).not.toContain('p-4');
        });

        it('should resolve conflicts using tailwind-merge', () => {
            // p-4 should overwrite p-2
            const result = cn('p-2', 'p-4');
            expect(result).toBe('p-4');
        });
    });
});

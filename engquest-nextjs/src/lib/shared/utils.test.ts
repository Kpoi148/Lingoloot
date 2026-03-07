// Tests for shared utility helpers.
import { cn, isRecent } from './utils';

describe('utils', () => {
    describe('cn', () => {
        it('should merge classes correctly', () => {
            expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
        });

        it('should handle tailwind conflicts', () => {
            expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
        });

        it('should handle conditional classes', () => {
            expect(cn('text-white', true && 'bg-blue-500', false && 'bg-red-500')).toBe('text-white bg-blue-500');
        });
    });

    describe('isRecent', () => {
        it('should return true for recent dates', () => {
            const now = new Date();
            expect(isRecent(now)).toBe(true);
        });

        it('should return false for old dates', () => {
            const oldDate = new Date();
            oldDate.setFullYear(2000);
            expect(isRecent(oldDate)).toBe(false);
        });
    });
});

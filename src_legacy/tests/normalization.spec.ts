
import { normalizeGenres } from '../utils/normalization';

describe('normalizeGenres', () => {
    it('should handle simple string input', () => {
        const fields = { genres: 'Action' };
        expect(normalizeGenres(fields)).toEqual(['Action']);
    });

    it('should handle array input', () => {
        const fields = { genres: ['Action', 'Drama'] };
        expect(normalizeGenres(fields)).toEqual(['Action', 'Drama']);
    });

    it('should handle JSON string array', () => {
        const fields = { genres: '["Action", "Drama"]' };
        expect(normalizeGenres(fields)).toEqual(['Action', 'Drama']);
    });

    it('should handle JSON string single', () => {
        // "Action" is valid JSON string
        const fields = { genres: '"Action"' };
        expect(normalizeGenres(fields)).toEqual(['Action']);
    });

    it('should handle busboy genres[] array', () => {
        const fields = { 'genres[]': ['Action', 'Drama'] };
        expect(normalizeGenres(fields)).toEqual(['Action', 'Drama']);
    });

    it('should handle mixed genres and genres[]', () => {
        const fields = { genres: 'Comedy', 'genres[]': ['Action'] };
        expect(normalizeGenres(fields)).toEqual(['Comedy', 'Action']);
    });

    it('should deduplicate genres', () => {
        const fields = { genres: ['Action', 'Action'] };
        expect(normalizeGenres(fields)).toEqual(['Action']);
    });

    it('should handle nested JSON arrays', () => {
        const fields = { genres: ['["Action"]', '["Drama"]'] };
        expect(normalizeGenres(fields)).toEqual(['Action', 'Drama']);
    });

    it('should handle malformed JSON gracefully', () => {
        const fields = { genres: '[Action' }; // invalid json
        expect(normalizeGenres(fields)).toEqual(['[Action']);
    });

    it('should handle non-string types gracefully', () => {
        const fields = { genres: 123 };
        expect(normalizeGenres(fields)).toEqual(['123']);
    });

    it('should ignore empty or null', () => {
        const fields = { genres: null };
        expect(normalizeGenres(fields)).toEqual([]);
    });
});

import { describe, it, expect } from 'vitest';
import { formatCpfCnpj, sumFarmsByState } from './formater';

describe('formater utils', () => {
    describe('formatCpfCnpj', () => {
        it('should format CPF correctly', () => {
            expect(formatCpfCnpj('12345678901')).toBe('123.456.789-01');
        });

        it('should format CNPJ correctly', () => {
            expect(formatCpfCnpj('12345678901234')).toBe('12.345.678/9012-34');
        });

        it('should return original value if length is not CPF or CNPJ', () => {
            expect(formatCpfCnpj('123')).toBe('123');
        });
    });

    describe('sumFarmsByState', () => {
        it('should sum farms by state correctly', () => {
            const mockFarms = [
                { state: 'AC' },
                { state: 'AL' },
                { state: 'AC' },
            ] as any[];

            const result = sumFarmsByState(mockFarms);
            expect(result).toEqual({
                Acre: 2,
                Alagoas: 1,
            });
        });

        it('should return empty object for empty farm list', () => {
            expect(sumFarmsByState([])).toEqual({});
        });
    });
});

import { customAlphabet } from 'nanoid';

export function generateId() {
    const nanoid = customAlphabet('1234567890abcdef', 12)
    return nanoid();
}
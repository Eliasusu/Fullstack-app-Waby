import { customAlphabet } from 'nanoid';	

export function generateUid(): string {
    const nanoid = customAlphabet('1234567890abcdef', 12)
    return nanoid();
}
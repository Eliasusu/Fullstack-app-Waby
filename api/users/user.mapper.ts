import type { User as UserDto } from '@waby/shared';
import type { User } from './user.entity.js';

/** Requiere `trainingMethods` cargado. Nunca incluye la contraseña. */
export function toUserDto(user: User): UserDto {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        birthdate: user.birthdate,
        phone: user.phone ?? null,
        bodyWeightKg: user.bodyWeightKg,
        heightCm: user.heightCm,
        role: user.role,
        trainingMethods: user.trainingMethods.getItems().map((method) => ({ id: method.id, name: method.name })),
    };
}

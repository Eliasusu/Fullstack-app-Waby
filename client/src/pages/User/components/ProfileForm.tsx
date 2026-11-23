import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterSchema } from "@waby/shared";
import { useAuth } from "@/users/auth.context.tsx";
import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import FieldError from "@/components/FieldError.tsx";
import { notifyResult } from "@/lib/notify.ts";
import { numberOrUndefined, validate, type FieldErrors } from "@/lib/validation.ts";
import { boxWidth } from "@/lib/layout.ts";

type ProfileValues = { username: string; name: string; email: string; phone: string; bodyWeightKg: string; heightCm: string };

/**
 * Lo que se edita en el perfil, con las reglas del registro (nota 66). No se usa UpdateUserSchema
 * porque ahí todo es opcional, y acá nombre, email, peso y altura no se pueden dejar vacíos.
 */
const ProfileSchema = RegisterSchema.pick({ username: true, name: true, email: true, phone: true, bodyWeightKg: true, heightCm: true });

export function ProfileForm() {
    const { user, updateProfile, deleteProfile } = useAuth();
    const navigate = useNavigate();
    const [values, setValues] = useState<ProfileValues>({
        username: user?.username ?? '',
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        bodyWeightKg: String(user?.bodyWeightKg ?? ''),
        heightCm: String(user?.heightCm ?? ''),
    });
    const [errors, setErrors] = useState<FieldErrors>({});

    if (!user) return null;

    const onSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const validation = validate(ProfileSchema, {
            username: values.username,
            name: values.name,
            email: values.email,
            // Vacío se manda como '' para poder borrar el teléfono (antes no se enviaba y quedaba el viejo).
            phone: values.phone,
            bodyWeightKg: numberOrUndefined(values.bodyWeightKg),
            heightCm: numberOrUndefined(values.heightCm),
        });
        setErrors(validation.ok ? {} : validation.errors);
        if (!validation.ok) return;
        notifyResult(await updateProfile(validation.data), { title: "Profile updated", description: "Your profile has been updated" });
    };

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;
        setValues({ ...values, [name]: value });
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your profile?")) return;
        // Se espera a que la API borre la cuenta antes de salir (nota 56).
        if (notifyResult(await deleteProfile(), { title: "Profile deleted", description: "Your profile has been deleted" })) {
            navigate('/');
        }
    };

    return (
        <>
            <div className="flex justify-center my-8">
                <BoxContainer width={boxWidth} height="w-[340]" padding="p-5">
                    <h1 className="font-bold text-2xl text-white-text pb-1">Profile</h1>
                    <p className="text-white-text text-sm pb-3">Update your profile</p>
                    <div className="flex flex-col items-center justify-center w-auto">
                        <form className="w-full flex flex-col gap-3 pt-1" id="formProfile" onSubmit={onSubmit} noValidate>
                            <div>
                                <Label htmlFor="username" className="text-white-text/60">Username</Label>
                                <Input type="text" id="username" name="username" placeholder="Username" className="w-full" value={values.username} onChange={handleChange} />
                                <FieldError message={errors.username} />
                            </div>
                            <div>
                                <Label htmlFor="name" className="text-white/60">Full name</Label>
                                <Input type="text" id="name" name="name" placeholder="Name" className="w-full" value={values.name} onChange={handleChange} />
                                <FieldError message={errors.name} />
                            </div>
                            <div>
                                <Label htmlFor="email" className="text-white/60">Email</Label>
                                <Input type="email" id="email" name="email" placeholder="Email" className="w-full" value={values.email} onChange={handleChange} />
                                <FieldError message={errors.email} />
                            </div>
                            <div>
                                <Label htmlFor="phone" className="text-white/60">Phone</Label>
                                <Input type="text" id="phone" name="phone" placeholder="Phone" className="w-full" value={values.phone} onChange={handleChange} />
                                <FieldError message={errors.phone} />
                            </div>
                            <div>
                                <Label htmlFor="bodyWeightKg" className="text-white/60">Body weight (kg)</Label>
                                <Input type="number" step="0.1" id="bodyWeightKg" name="bodyWeightKg" placeholder="Body Weight" className="w-full" value={values.bodyWeightKg} onChange={handleChange} />
                                <FieldError message={errors.bodyWeightKg} />
                            </div>
                            <div>
                                <Label htmlFor="heightCm" className="text-white/60">Height (cm)</Label>
                                <Input type="number" id="heightCm" name="heightCm" placeholder="Height" className="w-full" value={values.heightCm} onChange={handleChange} />
                                <FieldError message={errors.heightCm} />
                            </div>

                            <Button type="submit" className="bg-secondary">Update Profile</Button>
                            <Button type="button" onClick={handleDelete}>Delete Profile</Button>
                        </form>
                    </div>
                </BoxContainer >
            </div>
        </>
    );
}

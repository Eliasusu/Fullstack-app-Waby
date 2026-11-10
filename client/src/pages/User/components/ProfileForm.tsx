import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UpdateUserInput } from "@waby/shared";
import { useAuth } from "@/users/auth.context.tsx";
import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { notifyResult } from "@/lib/notify.ts";

type ProfileValues = { username: string; name: string; email: string; phone: string; bodyWeightKg: string; heightCm: string };

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

    if (!user) return null;

    const onSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const data: UpdateUserInput = {
            username: values.username,
            name: values.name,
            email: values.email,
            ...(values.phone ? { phone: values.phone } : {}),
            bodyWeightKg: Number(values.bodyWeightKg),
            heightCm: Number(values.heightCm),
        };
        notifyResult(await updateProfile(data), { title: "Profile updated", description: "Your profile has been updated" });
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
                <BoxContainer width="w-screen mx-3" height="w-[340]" padding="p-5">
                    <h1 className="font-bold text-2xl text-white-text pb-1">Profile</h1>
                    <p className="text-white-text text-sm pb-3">Update your profile</p>
                    <div className="flex flex-col items-center justify-center w-auto">
                        <form className="w-full flex flex-col gap-3 pt-1" id="formProfile" onSubmit={onSubmit}>
                            <div>
                                <Label htmlFor="username" className="text-white-text/60">Username</Label>
                                <Input type="text" id="username" name="username" placeholder="Username" className="w-full" value={values.username} onChange={handleChange} />
                            </div>
                            <div>
                                <Label className="text-white/60">Full name</Label>
                                <Input type="text" name="name" placeholder="Name" className="w-full" value={values.name} onChange={handleChange} />
                            </div>
                            <div>
                                <Label className="text-white/60">Email</Label>
                                <Input type="email" name="email" placeholder="Email" className="w-full" value={values.email} onChange={handleChange} />
                            </div>
                            <div>
                                <Label className="text-white/60">Phone</Label>
                                <Input type="text" name="phone" placeholder="Phone" className="w-full" value={values.phone} onChange={handleChange} />
                            </div>
                            <div>
                                <Label className="text-white/60">Body weight (kg)</Label>
                                <Input type="number" step="0.1" name="bodyWeightKg" placeholder="Body Weight" className="w-full" value={values.bodyWeightKg} onChange={handleChange} />
                            </div>
                            <div>
                                <Label className="text-white/60">Height (cm)</Label>
                                <Input type="number" name="heightCm" placeholder="Height" className="w-full" value={values.heightCm} onChange={handleChange} />
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

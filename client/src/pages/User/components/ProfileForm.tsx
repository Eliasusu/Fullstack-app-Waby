
import { useForm } from "react-hook-form";
import { useAuth } from "@/users/auth.context.tsx";
import { toast } from "@/hooks/use-toast.ts";
import { User } from "@/users/user.type.ts";
import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useState } from "react";

export function ProfileForm() {
    const { allDataUser, updateProfile, deleteProfile, getOneProfile, logout } = useAuth();
    const { handleSubmit } = useForm();
    const [values, setValues] = useState<User>(allDataUser || {} as User);

    const onSubmit = handleSubmit(async () => {

        if (!allDataUser) return

        const formatUser = {
            username: values.username || allDataUser.username,
            name: values.name || allDataUser.name,
            email: values.email || allDataUser.email,
            phone: values.phone || allDataUser.phone,
            bodyWeight: Number(values.bodyWeight || allDataUser?.bodyWeight),
            height: Number(values.height || allDataUser?.height),
        }

        updateProfile(allDataUser?.idUser || '', formatUser);
        getOneProfile(allDataUser?.idUser || '')
        toast({
            title: "Profile updated",
            description: "Your profile has been updated",
            duration: 500,
        })
    });

    const hangleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        evt.preventDefault()
        const { name, value } = evt.target
        setValues({
            ...values,
            [name]: value,
        })
    }

    return (
        <>
            <div className="flex justify-center my-8">
                <BoxContainer width="w-screen mx-3" height="w-[340]" padding="p-5">
                    <h1 className="font-bold text-2xl text-white-text pb-1">Profile</h1>
                    <p className="text-white-text text-sm pb-3">Update your profile</p>
                    <div className="flex flex-col items-center justify-center w-auto">
                        <form className="w-full flex flex-col gap-3 pt-1" id="formProfile" action="/profile" method="PUT"
                            onSubmit={onSubmit}>
                            <div>
                                <Label htmlFor="username" className="text-white-text/60">Username</Label>
                                <Input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    className="w-full"
                                    defaultValue={allDataUser?.username}
                                    onChange={hangleChange}
                                />
                            </div>
                            <div>
                                <Label className="text-white/60">Full name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    className="w-full"
                                    defaultValue={allDataUser?.name}
                                    onChange={hangleChange}
                                />
                            </div>
                            <div>
                                <Label className="text-white/60">Email</Label>
                                <Input
                                    type="text"
                                    name="email"
                                    placeholder="Email"
                                    className="w-full"
                                    defaultValue={allDataUser?.email}
                                    onChange={hangleChange}
                                />
                            </div>
                            <div>
                                <Label className="text-white/60">Phone</Label>
                                <Input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone"
                                    className="w-full"
                                    defaultValue={allDataUser?.phone}
                                    onChange={hangleChange}
                                />
                            </div>
                            <div>
                                <Label className="text-white/60">Body weight</Label>
                                <Input
                                    type="number"
                                    name="bodyWeight"
                                    placeholder="Body Weight"
                                    className="w-full"
                                    defaultValue={allDataUser?.bodyWeight}
                                    onChange={hangleChange}
                                />
                            </div>
                            <div>
                                <Label className="text-white/60">Height</Label>
                                <Input
                                    type="number"
                                    name="height"
                                    placeholder="Height"
                                    className="w-full"
                                    defaultValue={allDataUser?.height}
                                    onChange={hangleChange}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="bg-secondary"
                            >  Update Profile
                            </Button>
                            <Button
                                type="button"
                                className=""
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to delete your profile?")) {
                                        deleteProfile(allDataUser?.idUser || '')
                                        logout()
                                        toast({
                                            title: "Profile deleted",
                                            description: "Your profile has been deleted",
                                            duration: 500,
                                        })
                                    }
                                }}
                            >
                                Delete Profile
                            </Button>

                        </form>
                    </div>
                </BoxContainer >
            </div>
        </>
    );
}

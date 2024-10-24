import { UserSchema } from "@/users/user.schema.ts";
import { useForm } from "react-hook-form";
import { useAuth } from "@/users/auth.context.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';

export function ProfileForm() {
    const { user, updateProfile, deleteProfile } = useAuth();


    const form = useForm<z.infer<typeof UserSchema>>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            name: user?.name,
            username: user?.username,
            email: user?.email,
            birthdate: user?.birthdate,
            phone: user?.phone,
            bodyWeight: user?.bodyWeight,
            height: user?.height,
            trainingMethods: user?.trainingMethods
        },
    });

    function onSubmitUpdate(values: z.infer<typeof UserSchema>) {
        console.log(values);
        updateProfile({
            ...values,
            avatar: user?.avatar ?? '',
            password: user?.password ?? '',
            trainingMethods: user?.trainingMethods ?? []
        });
    }

    function onSubmitDelete(values: z.infer<typeof UserSchema>) {
        deleteProfile(values.idUser ?? '');
    }

    return (
        <div>
            <h1>Profile Form</h1>
            <form onSubmit={form.handleSubmit(onSubmitUpdate)}>
                <input {...form.register("name")} />
                <input {...form.register("username")} />
                <input {...form.register("email")} />
                <input {...form.register("birthdate")} />
                <input {...form.register("phone")} />
                <input {...form.register("bodyWeight")} />
                <input {...form.register("height")} />
                <input {...form.register("trainingMethods")} />
                <button type="submit">Update</button>
            </form>
            <form onSubmit={form.handleSubmit(onSubmitDelete)}>
                <input {...form.register("idUser")} />
                <button type="submit">Delete</button>
            </form>
        </div>
    );
}
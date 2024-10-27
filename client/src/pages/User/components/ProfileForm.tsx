import { UserSchema } from "@/users/user.schema.ts";
import { useForm } from "react-hook-form";
import { useAuth } from "@/users/auth.context.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { toast } from "@/hooks/use-toast.ts";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

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

    console.log(user);

    function onSubmitUpdate(values: z.infer<typeof UserSchema>) {
        updateProfile({
            ...values,
            avatar: user?.avatar ?? '',
            password: user?.password ?? '',
            trainingMethods: values.trainingMethods ?? []
        });
        toast({
            title: "Cambios guardados",
            description: "Los cambios se han guardado correctamente.",
        });
    }

    function onSubmitDelete() {
        deleteProfile(user?.idUser ?? '');
    }

    return (
        <>
            <div className="grid gap-4 py-4">
                <form
                    className="grid gap-4 py-4"
                    onSubmit={form.handleSubmit(onSubmitUpdate)}>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right">Name</label>
                        <Input
                            id="name"
                            className="col-span-3 w-full"
                            {...form.register("name")}
                            defaultValue={user?.name}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="username" className="text-right">Username</label>
                        <Input
                            id="username"
                            className="col-span-3 w-full"
                            {...form.register("username")}
                            defaultValue={user?.username}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="email" className="text-right">Email</label>
                        <Input
                            id="email"
                            className="col-span-3 w-full"
                            {...form.register("email")}
                            defaultValue={user?.email}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="birthdate" className="text-right">Birthdate</label>
                        <Input
                            type="date"
                            id="birthdate"
                            className="col-span-3 w-full"
                            {...form.register("birthdate")}
                            defaultValue={user?.birthdate ? user.birthdate.toISOString().split('T')[0] : ''}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="phone" className="text-right">Phone</label>
                        <Input
                            id="phone"
                            className="col-span-3 w-full"
                            {...form.register("phone")}
                            defaultValue={user?.phone}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="bodyWeight" className="text-right">Weight (kg)</label>
                        <Input
                            id="bodyWeight"
                            type="number"
                            step="0.1"
                            className="col-span-3 w-full"
                            {...form.register("bodyWeight")}
                            defaultValue={user?.bodyWeight}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="height" className="text-right">Height (cm)</label>
                        <Input
                            id="height"
                            type="number"
                            step="0.1"
                            className="col-span-3 w-full"
                            {...form.register("height")}
                            defaultValue={user?.height}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="trainingMethods" className="text-right">Training Method</label>
                        <select
                            id="trainingMethods"
                            className="col-span-3 w-full border rounded px-2 py-1"
                            {...form.register("trainingMethods")}
                            defaultValue={user?.trainingMethods}
                        >
                            <option value="Gym">Gym</option>
                            <option value="Calisthenics">Calisthenics</option>
                        </select>
                    </div>

                    <Button variant="outline" type="submit">
                        Save Changes
                    </Button>
                </form>

                <Button variant="destructive" onClick={onSubmitDelete}>
                    Delete Profile
                </Button>
            </div>
        </>
    );
}

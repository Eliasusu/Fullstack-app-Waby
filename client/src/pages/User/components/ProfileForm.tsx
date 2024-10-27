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
        <>
            <div className="grid gap-4 py-4">
                <form
                    className="grid gap-4 py-4"
                    onSubmit={form.handleSubmit(onSubmitUpdate)}>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="trainingName" className="text-right">Name</label>
                        <Input
                            id="name"
                            className="col-span-3 w-full" />
                    </div>
                    <Button
                        variant={"outline"}
                        onClick={() =>
                            toast({
                                title: "Cambios guardados",
                                description: "Los cambios se han guardado correctamente.",

                            })}
                    >Save Changes</Button>
                </form>
            </div>
        </>
    );
}
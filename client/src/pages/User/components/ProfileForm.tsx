
import { useForm } from "react-hook-form";
import { useAuth } from "@/users/auth.context.tsx";
import { toast } from "@/hooks/use-toast.ts";
import { User } from "@/users/user.type.ts";
import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

export function ProfileForm() {
    const { allDataUser, updateProfile, deleteProfile, errors: registerErrors } = useAuth();
    const { handleSubmit } = useForm();


    const onSubmit = handleSubmit(async (values) => {

        const user: User = {
            username: values.username,
            password: values.password,
            avatar: values.username,
            email: values.email,
            name: values.name,
            birthdate: values.birthdate,
            phone: values.phone,
            bodyWeight: values.bodyWeight,
            height: values.height,
        };
        updateProfile(user);
        toast({
            title: "Profile updated",
            description: "Your profile has been updated",
            duration: 5000,
        })
    });

    const hangleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        evt.preventDefault()
    }

    return (
        <div className="flex justify-center my-8">
            <BoxContainer width="w-screen mx-3" height="w-[340]" padding="p-5">
                <h1 className="font-bold text-2xl text-white-text pb-1">Profile</h1>
                <p className="text-white-text text-sm pb-3">Update your profile</p>
                <div className="flex flex-col items-center justify-center w-auto">
                    {
                        Array.isArray(registerErrors) && (registerErrors).map((error: string, index: number) => (
                            <div key={index} className="bg-red w-auto p-2 mb-3 text-white text-xs rounded-md " >{error}</div>
                        ))

                    }
                    <form className="w-full flex flex-col gap-3 pt-1" id="formProfile" action="/profile" method="PUT"
                        onSubmit={onSubmit}>
                        <div>
                            <Input
                                type="text"
                                name="username"
                                placeholder="Username"
                                className="w-full"
                                defaultValue={allDataUser?.username}
                                onChange={hangleChange}
                            />
                        </div>
                        <Input
                            type="text"
                            name="name"
                            placeholder="Name"
                            className="w-full"
                            defaultValue={allDataUser?.name}
                            onChange={hangleChange}
                        />
                        <Input
                            type="text"
                            name="email"
                            placeholder="Email"
                            className="w-full"
                            defaultValue={allDataUser?.email}
                            onChange={hangleChange}
                        />
                        <Input
                            type="date"
                            name="birthdate"
                            placeholder="Birthdate"
                            className="w-full"
                            defaultValue={allDataUser?.birthdate}
                            onChange={hangleChange}
                        />
                        <Input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            className="w-full"
                            defaultValue={allDataUser?.phone}
                            onChange={hangleChange}
                        />
                        <Input
                            type="text"
                            name="bodyWeight"
                            placeholder="Body Weight"
                            className="w-full"
                            defaultValue={allDataUser?.bodyWeight}
                            onChange={hangleChange}
                        />
                        <Input
                            type="text"
                            name="height"
                            placeholder="Height"
                            className="w-full"
                            defaultValue={allDataUser?.height}
                            onChange={hangleChange}
                        />
                        <Button
                            type="submit"
                            className="bg-secondary"
                        >  Update Profile
                        </Button>
                        <Button
                            type="button"
                            className=""
                            onClick={() => {
                                deleteProfile(allDataUser?.idUser || '')
                            }}
                        >  Delete Profile
                        </Button>

                    </form>
                </div>
            </BoxContainer>
        </div>
    );
}

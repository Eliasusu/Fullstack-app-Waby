import { UserSchema } from "@/users/user.schema.ts";
import { Form, useForm } from "react-hook-form";
import { useAuth } from "@/users/auth.context.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form.tsx";
import { format } from "date-fns";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react";

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
            <Form {...form}>
                <h1>Profile</h1>
                <form
                    onSubmit={form.handleSubmit(onSubmitUpdate)}
                    className="flex flex-col gap-4"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <input placeholder="name" {...field} />
                                </FormControl>

                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <input placeholder="username" {...field} />
                                </FormControl>

                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <input placeholder="email" {...field} />
                                </FormControl>

                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="birthdate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date of birth</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                            initialFocus />
                                    </PopoverContent>
                                </Popover>

                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <input placeholder="phone" {...field} />
                                </FormControl>

                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="bodyWeight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>bodyWeight"</FormLabel>
                                <FormControl>
                                    <input placeholder="bodyWeight" {...field} />
                                </FormControl>

                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Height"</FormLabel>
                                <FormControl>
                                    <input placeholder="height" {...field} />
                                </FormControl>

                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="trainingMethods"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>trainingMethods"</FormLabel>
                                <FormControl>
                                    <input placeholder="trainingMethods" {...field} />
                                </FormControl>

                            </FormItem>
                        )} />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
            <div>
                <Button onClick={() => onSubmitDelete}></Button>
            </div>
        </>
    );
}
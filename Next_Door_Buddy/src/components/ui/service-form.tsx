"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "#/components/ui/form"
import {Input} from "#/components/ui/input"
import {Button} from "#/components/ui/button"
import {Textarea} from "#/components/ui/textarea"
import {getprofile} from "#/lib/api_requests/user"
import {Service} from "#/types/service"
import {createService} from "#/lib/api_requests/services"

const formSchema = z.object({
    title: z.string().min(5, {
            message: "Title must be at least 5 characters.",
        },
    ),
    description:
        z.string().min(10,
            {
                message: "Description must be at least 10 characters"
            }),
})

export function ProfileForm() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const profile = await getprofile()
        console.log(values, profile)
        const service: Service = {
            ...values,
            asker: profile.email,
            createdAt: new Date(),
            open: true,
        }
        await createService(service).then( ()=> {
            window.location.href = '/services'
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Title </FormLabel>
                            <FormControl>
                                <Input placeholder="My problem"
                                       {...
                                           field
                                       }
                                />
                            </FormControl>
                            <FormDescription>This is the title of the service you&#39;re asking for.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )
                    }

                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Description </FormLabel>
                            <FormControl>
                                <Textarea placeholder="I need help with..."
                                          {...
                                              field
                                          }
                                />
                            </FormControl>
                            <FormDescription>This is the description of the service you&#39;re asking
                                for.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )
                    }

                />

                <Button type={"submit"}>Submit </Button>
            </form>
        </Form>
    )
}


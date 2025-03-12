"use client";

import Form from "next/form";
import {FormEvent} from "react";

function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!email || !password|| email === "" || password === "") {
        return;
    }
    if (password.length < 8) {
        return;
    }


    fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
    }).then((response) => {
        if (response.ok) {
            window.location.href = "/home";
        }
    });


}

export default function Login(){


    return (
        <Form action={"/login"} formMethod={"POST"} onSubmit={event => handleSubmit(event)}>
            <label>
                Email
                <input type="email" name="email" required/>
            </label>
            <label>
                Password
                <input type="password" name="password" required/>
            </label>
            <button type="submit">Login</button>
        </Form>
    )
}
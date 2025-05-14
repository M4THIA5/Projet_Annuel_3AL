import * as React from 'react'
import {Button, Html} from "@react-email/components"

export function Email(props: { url: string }) {
    const {url} = props

    return (
        <Html lang="en">
            <Button href={url}>Click me</Button>
        </Html>
    )
}

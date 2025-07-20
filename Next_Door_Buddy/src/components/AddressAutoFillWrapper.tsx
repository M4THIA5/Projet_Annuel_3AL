// src/components/wrappers/AddressAutofillWrapper.tsx
"use client"

import React from "react"
import { AddressAutofill } from "@mapbox/search-js-react"
import {AddressAutofillProps} from "@mapbox/search-js-react/src/components/AddressAutofill"

export default function AddressAutofillWrapper(props: AddressAutofillProps & { children: React.ReactNode }) {
    return (
        <AddressAutofill {...props}>
            {props.children}
        </AddressAutofill>
    )
}

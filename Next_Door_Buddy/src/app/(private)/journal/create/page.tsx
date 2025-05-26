"use client"
import {SimpleEditor} from "#/components/tiptap-templates/simple/simple-editor"
import {createJournal} from "#/lib/api_requests/jounal"
import {Button} from "#/components/tiptap-ui-primitive/button"
import {useState} from "react"

export default function Journal() {
    const [types, setTypes] = useState("")
    const [district, setDistrict] = useState("")
    const [editorContent, setEditorContent] = useState("")

    const handleCallback = (childData: string) => {
        setEditorContent(childData)
    }
    return (
        <div className={`h-screen flex flex-col items-center justify-center`}>
            <h1>Journal</h1>
            <form>
                <input onChange={(e) => setTypes(e.target.value)} placeholder={"Enter types"} name={"types"}></input>
                <input onChange={(e) => setDistrict(e.target.value)} placeholder={"Enter district"}
                       name={"district"}></input>
                <SimpleEditor parentCallback={handleCallback}/>
                <Button data-style={"primary"} data-size={"big"} data-appearance={"default"}
                        onClick={async (e) => {
                            e.preventDefault()
                            const z = await createJournal({
                                types: [types],
                                districtId: district,
                                content: editorContent
                            })
                            if (z) {
                                window.location.href = "/"
                            }
                        }
                        }>Envoyer </Button>
            </form>
        </div>
    )
}

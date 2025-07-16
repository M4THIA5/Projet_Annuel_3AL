import * as React from "react"
import type { Editor } from "@tiptap/react"
import { Button } from "#/components/ui/button"
import { Label } from "#/components/ui/label"
import { Input } from "#/components/ui/input"
import Resizer from "react-image-file-resizer"

interface ImageEditBlockProps {
    editor: Editor
    close: () => void
}

export const ImageEditBlock: React.FC<ImageEditBlockProps> = ({
                                                                  editor,
                                                                  close,
                                                              }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [link, setLink] = React.useState("")

    const handleClick = React.useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    const resizeFile = (file: File): Promise<string> =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                600,       // width
                400,       // height
                "JPEG",    // format
                100,       // quality
                0,         // rotation
                (uri) => resolve(uri as string),
                "base64"   // output type
            )
        })

    const handleFile = React.useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files
            if (!files?.length) return

            const contentBucket = []
            const filesArray = Array.from(files)

            for (const file of filesArray) {
                const resizedSrc = await resizeFile(file)
                contentBucket.push({ src: resizedSrc })
            }

            editor.commands.setImages(contentBucket)
            close()
        },
        [editor, close]
    )

    const handleSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            e.stopPropagation()

            if (!link) return

            try {
                const response = await fetch(link)
                const blob = await response.blob()

                const file = new File([blob], "remote-image.jpg", { type: blob.type })
                const resizedSrc = await resizeFile(file)

                editor.commands.setImages([{ src: resizedSrc }])
                close()
            } catch (error) {
                console.error("Failed to load or resize image from link:", error)
            }
        },
        [editor, link, close]
    )

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
                <Label htmlFor="image-link">Attach an image link</Label>
                <div className="flex">
                    <Input
                        id="image-link"
                        type="url"
                        required
                        placeholder="https://example.com"
                        value={link}
                        className="grow"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setLink(e.target.value)
                        }
                    />
                    <Button type="submit" className="ml-2">
                        Submit
                    </Button>
                </div>
            </div>
            <Button type="button" className="w-full" onClick={handleClick}>
                Upload from your computer
            </Button>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                multiple
                className="hidden"
                onChange={handleFile}
            />
        </form>
    )
}

export default ImageEditBlock

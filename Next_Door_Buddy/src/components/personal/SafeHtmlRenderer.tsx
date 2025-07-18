import React, { useEffect, useRef } from "react"
import DOMPurify from "dompurify"

interface SafeHtmlRendererProps {
    html: string
    maxHeight?: string
    maxWidth?: string
}

const SafeHtmlRenderer: React.FC<SafeHtmlRendererProps> = ({
                                                               html,
                                                               maxHeight = "300px",
                                                               maxWidth = "100%"
                                                           }) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const shadow = container.shadowRoot || container.attachShadow({ mode: "open" })

        const sanitizedHtml = DOMPurify.sanitize(html)

        // Create wrapper
        const wrapper = document.createElement("div")
        wrapper.className = "safe-html-wrapper"
        wrapper.innerHTML = sanitizedHtml

        // Add styles
        const style = document.createElement("style")
        style.textContent = `
            .safe-html-wrapper {
                max-height: ${maxHeight};
                max-width: ${maxWidth};
                overflow: auto;
            }

            h1, h2, h3, h4, h5, h6 {
                font-size: revert;
                font-weight: revert;
            }
        `

        shadow.innerHTML = ""
        shadow.appendChild(style)
        shadow.appendChild(wrapper)
    }, [html, maxHeight, maxWidth])

    return <div ref={containerRef} />
}

export default SafeHtmlRenderer

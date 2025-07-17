import React from "react"
import DOMPurify from "dompurify"

interface SafeHtmlRendererProps {
    html: string
}

const SafeHtmlRenderer: React.FC<SafeHtmlRendererProps> = ({ html }) => {
    const cleanHtml = React.useMemo(() => DOMPurify.sanitize(html), [html])

    return (
        <div
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
    )
}

export default SafeHtmlRenderer

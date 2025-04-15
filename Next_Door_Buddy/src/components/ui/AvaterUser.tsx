import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "#/components/ui/avatar"

interface AvatarUserProps {
    src: string;
    alt: string;
    fallback: string;
}

export function AvatarUser({ src, alt, fallback }: AvatarUserProps) {
    return (
        <Avatar>
            <AvatarImage src={src} alt={alt} />
            <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
    )
}

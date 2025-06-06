import {Button, Html} from "@react-email/components"

export function Email(props: { url: string }) {
    const {url} = props

    return (
        <Html lang="en">
            <Button href={url}>Click me</Button>
        </Html>
    )
}

export function ResetPasswordEmail(props: { url: string }) {
    const {url} = props

    return (
        <Html lang="en">
            <div style={{fontFamily: 'Arial, sans-serif', padding: '20px'}}>
                <h1>Réinitialisation de votre mot de passe</h1>
                <p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous :</p>
                <p>
                    <a href={url} style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: '#ffffff',
                        textDecoration: 'none',
                        borderRadius: '5px'
                    }}>
                        Réinitialiser le mot de passe
                    </a>
                </p>
                <p>Si vous n&apos;avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.</p>
                <p>Merci,</p>
                <p>L&apos;équipe de support</p>
            </div>
        </Html>
    )
}


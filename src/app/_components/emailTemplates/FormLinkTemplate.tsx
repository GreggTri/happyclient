import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.VERCEL_URL
? `https://${process.env.VERCEL_URL}`
: "";

export const FormLinkTemplate = () => {
    return (
    <Html>
        <Head />
        <Preview>Dropbox reset your password</Preview>
        <Body style={main}>
        <Container style={container}>
            <Img
            src={`${baseUrl}/static/dropbox-logo.png`}
            width="40"
            height="33"
            alt="Dropbox"
            />
            <Section>
            <Text style={text}>Hi {userFirstname},</Text>
            <Text style={text}>
                Someone recently requested a password change for your Dropbox
                account. If this was you, you can set a new password here:
            </Text>
            <Button style={button} href={resetPasswordLink}>
                Reset password
            </Button>
            <Text style={text}>
                If you don&apos;t want to change your password or didn&apos;t
                request this, just ignore and delete this message.
            </Text>
            <Text style={text}>
                To keep your account secure, please do <b>NOT</b> forward this email
                to anyone. See our Help Center for{" "}
                <Link style={anchor} href="https://dropbox.com">
                more security tips.
                </Link>
            </Text>
            <Text style={text}>Go make some happy clients!</Text>
            </Section>
        </Container>
        </Body>
    </Html>
    );
};


export default FormLinkTemplate;
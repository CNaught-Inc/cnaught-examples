import {
    Body,
    Container,
    Font,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text
} from '@react-email/components';

import * as React from 'react';

interface ConfirmationEmailProps {
    senderName: string;
    senderTitle: string;
    eventName: string;
    amountKg: number;
    signupLink: string;
}

export const ConfirmationEmail = ({
    senderName,
    senderTitle,
    eventName,
    amountKg,
    signupLink
}: ConfirmationEmailProps) => {
    const previewText = `We've retired ${amountKg} kilograms of carbon credits on your behalf`;
    return (
        <Html>
            <Head>
                <Font
                    fontFamily="'Noto Sans'"
                    fallbackFontFamily="Arial"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/notosans/v30/o-0NIpQlx3QUlC5A4PNjThZVatyBx2pqPIif.woff2',
                        format: 'woff2'
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>${previewText}</Preview>
            <Body style={main}>
                <Container style={{ margin: '0 auto', width: '600px' }}>
                    <Img
                        src={`https://app.cnaught.com/assets/cnaught_logo_full.svg`}
                        height="48px"
                        alt="CNaught"
                    />
                    <Section style={mainBody}>
                        <Text style={heading}>
                            Congrats! We&rsquo;ve retired {amountKg} kilograms
                            of carbon credits on your behalf.
                        </Text>
                        <Text style={text}>
                            Attached, you’ll find a certificate showing how you
                            supported multiple projects as part of a{' '}
                            <Link
                                style={anchor}
                                href="https://www.cnaught.com/science-backed-portfolio"
                            >
                                science-backed portfolio
                            </Link>{' '}
                            that drives real impact.
                        </Text>
                        <Text style={text}>
                            If you’d like to learn more about how easy it can be
                            to use carbon credits with confidence, come chat
                            with us at {eventName} or{' '}
                            <Link style={anchor} href={signupLink}>
                                sign up online
                            </Link>{' '}
                            and get your first tonne of carbon credits for free.
                        </Text>
                        <Text style={text}>Thanks for doing your part!</Text>
                        <Text style={text}>
                            {senderName} <br /> {senderTitle}
                        </Text>
                    </Section>
                    <Text style={footer}>
                        © CNaught Inc. 333 Bush St, 4th Floor, San Francisco CA
                        94104 USA
                    </Text>
                    <Text style={footerLinks}>
                        <Link
                            href="https://github.com/cnaught-inc"
                            style={footerAnchor}
                        >
                            Github
                        </Link>{' '}
                        •{' '}
                        <Link
                            href="https://twitter.com/cnaughtapi"
                            style={footerAnchor}
                        >
                            Twitter
                        </Link>{' '}
                        •{' '}
                        <Link
                            href="https://www.linkedin.com/company/cnaught"
                            style={footerAnchor}
                        >
                            LinkedIn
                        </Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: '#8DB0C3',
    padding: '15px'
};

const mainBody = {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f0f0',
    padding: '30px',
    marginTop: '25px'
};

const heading = {
    fontSize: '24px',
    fontFamily:
        "'Noto Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
    fontWeight: '300',
    color: '#294661',
    lineHeight: 1.5
};

const text = {
    fontSize: '16px',
    fontFamily:
        "'Noto Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
    fontWeight: '300',
    color: '#294661',
    lineHeight: '26px'
};

const footer = {
    textAlign: 'center' as const,
    color: '#fff',
    fontSize: '12px',
    fontFamily:
        "'Noto Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
    fontWeight: '800',
    lineHeight: 1.5
};

const footerLinks = {
    textAlign: 'center' as const,
    color: '#fff',
    fontSize: '12px',
    fontFamily:
        "'Noto Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
    fontWeight: '400',
    lineHeight: 1.5
};

const anchor = {
    textDecoration: 'underline',
    color: '#D0533F'
};

const footerAnchor = {
    boxSizing: 'border-box' as const,
    color: '#fff',
    padding: '0 5px'
};

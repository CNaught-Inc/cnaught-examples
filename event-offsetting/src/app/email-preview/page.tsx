import { render } from '@react-email/render';

import { ConfirmationEmail } from '@/emails/Confirmation';

export default async function Index() {
    const emailHtml = render(
        ConfirmationEmail({
            senderName: 'John Doe',
            senderTitle: 'CEO and Co-founder',
            eventName: 'Verge',
            amountKg: 40,
            signupLink: 'https://app.cnaught.com/api/auth/signup'
        })
    );

    return (
        <div>
            <iframe srcDoc={emailHtml} style={{ width: '1024px', height: '968px' }} />
        </div>
    );
}

import { ConfirmationEmail } from '@/emails/Confirmation';
import { render } from '@react-email/render';

import { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';
import wretch from 'wretch';

import { db } from '../../db';

const eventName = process.env.NEXT_PUBLIC_EVENT_NAME as string;

const senderEmail =
    process.env.EMAIL_FROM_ADDRESS ??
    'cnaught-event-offset-app-demo@cnaught.com';
const senderName = process.env.EMAIL_FROM_NAME ?? 'CNaught Event Offset App';
const senderTitle = process.env.EMAIL_FROM_TITLE ?? '';
const smtpHost = process.env.EMAIL_SMTP_HOST;
const smtpPort = process.env.EMAIL_SMTP_PORT
    ? parseInt(process.env.EMAIL_SMTP_PORT)
    : undefined;
const smtpUser = process.env.EMAIL_SMTP_USER;
const smtpPassword = process.env.EMAIL_SMTP_PASSWORD;

export async function POST(request: NextRequest) {
    if (!smtpHost) {
        console.log(
            `Email SMTP configuration incomplete, no confirmation email sent`
        );

        return new Response(null, { status: 200 });
    }

    const { order } = (await request.json()) as {
        order: {
            id: string;
            state: string;
            amount_kg: number;
            subaccount_id: string;
            certificate_download_public_url: string;
        };
    };

    if (!order) {
        console.log('Received empty webhook');
        return new Response(null, { status: 400 });
    }

    if (order.state !== 'fulfilled') {
        console.log(`Ignoring webhook with state ${order.state}`);
        return new Response(null, { status: 400 });
    }

    console.log(`Received webhook for order ${order.id}`);

    const user = await db
        .selectFrom('users')
        .where('cnaught_subaccount_id', '=', order.subaccount_id)
        .select(['first_name', 'last_name', 'email'])
        .executeTakeFirst();

    if (!user) {
        console.log(`No user found with subaccount id ${order.subaccount_id}`);
        return new Response(null, { status: 500 });
    }

    console.log('Downloading certificate file to attach');

    const fileContent = await downloadFileAsBuffer(
        order.certificate_download_public_url
    );

    console.log(`Sending email to ${user.email}`);

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: true,
        auth: {
            user: smtpUser,
            pass: smtpPassword
        }
    });

    const emailHtml = render(
        ConfirmationEmail({
            senderName,
            senderTitle,
            eventName,
            amountKg: order.amount_kg,
            signupLink: 'https://app.cnaught.com/api/auth/signup'
        })
    );

    await transporter.sendMail({
        from: {
            name: 'The CNaught Team',
            address: senderEmail
        },
        to: {
            name: `${user.first_name} ${user.last_name}`,
            address: user.email
        },
        subject: `Congrats on offsetting your travel to ${eventName}`,
        html: emailHtml,
        attachments: [
            {
                content: fileContent,
                contentType: 'application/pdf',
                filename: `cnaught_certificate_${order.id}.pdf`
            }
        ]
    });

    console.log(`Email sent to ${user.email}`);

    return new Response(null, { status: 200 });
}

async function downloadFileAsBuffer(fileUrl: string) {
    const arrayBuffer = await wretch(fileUrl).get().arrayBuffer();
    return Buffer.from(arrayBuffer);
}

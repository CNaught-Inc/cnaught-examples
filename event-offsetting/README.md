# Event Travel Offsetting App using Next.js, CNaught SDK, Google Maps API and Leaflet 

This is an example app to illustrate how to use the CNaught API to integrate carbon credits into a
web application. The app allows travelers to an event such as a conference to offset their travel to the event.

This demonstrates the following capabilities:

* Using the API to purchase carbon credits
* Using the API to retrieve and display total climate compact
* Using webhooks from the API to be notified when carbon credits are fulfilled, and retrieving and emailing 
confirmation emails with certificates for the credits

## Running the app locally

The examples below assume using `bun` as package manager, but other package managers should work as well.

### Install the dependencies

```bash
bun install
```

### Set up a database

The app requires a database for storing data about the travelers, for displaying the impact page.
The current implementation expects a Postgres database, though it would be easy to modify it to
use any other data store. You could either run the DB locally or use a provider like Neon or Vercel Storage.

#### Local database

The repository includes a [docker-compose.yml](docker-compose.yml) for running a local Postgres DB and a WebSocket
proxy (needed to access the DB from Next.js edge environment). Simply run `docker compose up` and it should be ready to go.

#### Cloud-based database

Go to [Neon](https://neon.tech) or another provider to create a free tier database.

### Set up webhook proxy

In order for the app to send confirmation emails with the carbon credits certificate, it needs to be
able to receive webhooks from CNaught API when the carbon credits order is fulfilled. For running the
app locally, this will require setting up a webhook proxy like `ngrok`

If using `ngrok`, follow steps 1 and 2 from their [Quickstart](https://ngrok.com/docs/getting-started/) to install ngrok
and connect it to your account. Then start ngrok with the command `ngrok http http://localhost:3000` and note the Forwarding URL.
If using a different tool, follow its instructions and note its forwarding URL.

### Configure required environment variables

Copy `.env.local.sample` to `.env.local` and fill out the needed values:

| Variable                                 | Required? | Description                                                                                                                                                                                                                              |
|------------------------------------------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `EVENT_LOCATION`                         | yes       | The location for your event. Follow the JSON format from `.env.local.sample`                                                                                                                                                             |
| `NEXT_PUBLIC_EVENT_NAME`                 | yes       | The name of your event                                                                                                                                                                                                                   |
| `NEXT_PUBLIC_EVENT_DESTINATION_AIRPORTS` | yes       | A list of airports that people travelling to your event could fly into. JSON format from `.env.local.sample`. Any number of airports can be entered.                                                                                     |
| `CNAUGHT_API_KEY`                        | yes       | Your CNaught API key (if you don't have one yet, [Sign Up](https://app.cnaught.com/api/auth/signup) now)                                                                                                                                 |
| `CNAUGHT_API_URL`                        | yes       | The base URL for the CNaught API requests. You should generally leave this as `https://api.cnaught.com` needing to use a non-production version of the API                                                                               |
| `CNAUGHT_API_WEBHOOK_URL`                | yes       | The URL for the CNaught API to send webhooks to the app. This should be the Forwarding URL from setting up the webhook proxy                                                                                                             |
| `NEXT_PUBLIC_GOOGLE_API_KEY`             | yes       | Google Maps API key. The free tier is sufficient.                                                                                                                                                                                        | 
| `NEXT_PUBLIC_ESRI_API_KEY`               | no        | Optional [ESRI](https://developers.arcgis.com) API key, for displaying vector-based map on the impact page. If not present, will use raster tiles.                                                                                       |
| `POSTGRES_URL`                           | yes       | URL for your Postgres database                                                                                                                                                                                                           |
| `POSTGRES_USE_WS_PROXY`                  | no        | Indicator controlling whether to use a websocket proxy for connecting to the database. Set to 1 if using a local database.                                                                                                               |
| `EMAIL_SMTP_*`                           | no        | Optional settings for sending confirmation emails. You can use any email provider, e.g. [Forward Email](https://forwardemail.net/), [SendGrid](https://sendgrid.com), Amazon SES, etc. If not set, confirmation emails will not be sent. |
| `EMAIL_FROM_*`                           | no        | Optional settings for configuring who the confirmation emails are sent from                                                                                                                                                              |

### Run migrations

Once the environment variables are set up, run DB migrations to create the database.

```
npx prisma migrate dev
```

### Run the local server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the page for entering traveller information and offsetting the travel.

Go to [http://localhost:3000/impact](http://localhost:3000/impact) to view the impact page. It will be updated live as travel is offset.

## Deploying the app

### Deploying on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcnaught-inc%2Fcnaught-examples%2Ftree%2Fmain%2Fevent-offsetting&project-name=event-offsetting&repository-name=event-offsetting&env=EVENT_LOCATION,NEXT_PUBLIC_EVENT_NAME,NEXT_PUBLIC_EVENT_DESTINATION_AIRPORTS,CNAUGHT_API_KEY,CNAUGHT_API_URL,NEXT_PUBLIC_GOOGLE_API_KEY,EMAIL_SMTP_HOST,EMAIL_SMTP_POST,EMAIL_SMTP_USER,EMAIL_SMTP_PASSWORD,EMAIL_FROM_ADDRESS,EMAIL_FROM_NAME)

Before deploying, you will need to set up your production database. The easiest option is to use Vercel Storage; you could also use [Neon](https://neon.tech) directly.
The app uses the Neon serverless driver to connect to the database, so other DB providers would not work without code changes.

Once the project is imported into Vercel, you will need to configure the same environment variables listed in the guide 
for running the app locally in Vercel's Environment Variables settings page, with the following adjustments:

| Variable                                 | Required? | Description                                                                                                                                                                                                                                           |
|------------------------------------------|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `CNAUGHT_API_WEBHOOK_URL`                | no        | The URL for the CNaught API to send webhooks to the app. If not set, will use VERCEL_URL which is automatically set to the auto-generated Vercel deployment url. If you configure a custom domain for your Vercel deployment, then set this to match. |
| `POSTGRES_URL`                           | yes       | URL for your Postgres database. If using Vercel Postgres, after connecting it to your project this will be set automatically.                                                                                                                         |
| `POSTGRES_USE_WS_PROXY`                  | no        | Don't set this as long as you use Vercel Storage or Neon as your database provider.                                                                                                                                                                   |

You will also need to set deployment protection to "preview only" or turn it off, otherwise the CNaught API will be unable to 
send webhooks to the app.
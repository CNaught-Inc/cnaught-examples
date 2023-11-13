import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet/dist/leaflet.css';

export const metadata = {
    title: 'CNaught - Carbon Offsets Platform',
    description: `Offset emissions from your travel to ${process.env.NEXT_PUBLIC_EVENT_NAME}`
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}

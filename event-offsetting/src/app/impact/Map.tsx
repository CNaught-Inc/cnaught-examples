// Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import { PropsWithChildren } from 'react';
import { BasemapLayer } from 'react-esri-leaflet';
import VectorBasemapLayer from 'react-esri-leaflet/plugins/VectorBasemapLayer';
import { MapContainer, MapContainerProps } from 'react-leaflet';

type MapProps = PropsWithChildren<
    {
        height?: string;
        width?: string;
    } & MapContainerProps
>;

export function Map({
    height,
    width,
    zoom = 12,
    children,
    ...mapProps
}: MapProps) {
    const esriApiKey = process.env.NEXT_PUBLIC_ESRI_API_KEY;

    // noinspection XmlDeprecatedElement
    return (
        <MapContainer
            zoom={zoom}
            style={{
                ...(height && { height }),
                ...(width && { width })
            }}
            {...mapProps}
        >
            {esriApiKey && (
                <VectorBasemapLayer name="ArcGIS:Streets" apiKey={esriApiKey} />
            )}
            {!esriApiKey && <BasemapLayer name="Topographic" />}
            {children}
        </MapContainer>
    );
}

import wretch from 'wretch';

export class GoogleApi {
    static async geocode(apiKey: string, placeId: string) {
        const searchParams = new URLSearchParams({
            place_id: placeId,
            key: apiKey
        });
        const originGeocodeRes = await wretch(`https://maps.googleapis.com/maps/api/geocode/json?${searchParams}`)
            .get()
            .json<any>();
        return originGeocodeRes.results[0];
    }
}

import {Request, RequestHandler, Response} from "express";
import {config} from "../config/env";

const MAPBOX_API_KEY = config.MAPBOX_API_KEY;

class MapBoxController {

    public async fetchNeighborhoodFromAddress(address: string) {
        if (!MAPBOX_API_KEY) {
            throw new Error("API key Mapbox manquante");
        }

        const encodedAddress = encodeURIComponent(address);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_API_KEY}&limit=1`;

        const response = await fetch(url);
        const mapboxStatus = response.status;

        if (!response.ok) {
            throw new Error(`Erreur API Mapbox: ${response.statusText}`);
        }

        const data = await response.json();
        const feature = data.features?.[0];
        if (!feature) {
            throw new Error("Adresse non trouvée");
        }

        const context = feature.context ?? feature.properties?.context ?? [];

        const district =
            context.find((c: any) => typeof c.id === "string" && c.id.startsWith("district"))?.text ??
            context.find((c: any) => typeof c.id === "string" && c.id.startsWith("locality"))?.text ??
            context.find((c: any) => typeof c.id === "string" && c.id.startsWith("neighborhood"))?.text ??
            context.find((c: any) => typeof c.id === "string" && c.id.startsWith("place"))?.text ??
            feature.text ??
            feature.place_name ??
            null;

        const fullAddress = feature.place_name ?? null;

        const city =
            context.find((c: any) => typeof c.id === "string" && c.id.startsWith("place"))?.text ?? null;

        const postalCode =
            context.find((c: any) => typeof c.id === "string" && c.id.startsWith("postcode"))?.text ?? null;

        const [longitude, latitude] = feature.center ?? [null, null];

        return {
            status: mapboxStatus,
            district,
            city,
            postalCode,
            latitude,
            longitude,
            address: fullAddress,
        };
    }

    getNeighborhood: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const address = req.query.address as string;
        if (!address || address.trim().length === 0) {
            res.status(400).send("Paramètre 'address' manquant ou vide");
            return;
        }

        try {
            const data = await this.fetchNeighborhoodFromAddress(address);
            res.status(200).json(data);
        } catch (err: any) {
            res.status(500).json({
                status: 500,
                error: err.message || "Erreur serveur",
            });
        }
    };
    getAdresseMapBox: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { lat, lon } = req.query;

            if (!lat || !lon) {
                res.status(400).json({ error: 'Missing latitude or longitude' });
                return;
            }

            const latitude = parseFloat(lat as string);
            const longitude = parseFloat(lon as string);

            if (isNaN(latitude) || isNaN(longitude)) {
                res.status(400).json({ error: 'Invalid latitude or longitude format' });
                return;
            }

            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_API_KEY}&types=neighborhood,place,address,postcode`;

            const response = await fetch(url);
            const mapboxStatus = response.status;

            if (!response.ok) {
                res.status(502).json({ error: 'Error fetching data from Mapbox' });
                return;
            }

            const data = await response.json();
            const feature = data.features?.[0];

            if (!feature) {
                res.status(404).json({ status: 404, error: "Adresse non trouvée" });
                return;
            }

            const context = feature.context ?? feature.properties?.context ?? [];

            const fullAddress = feature.place_name ?? null;

            const city =
                context.find((c: any) => typeof c.id === "string" && c.id.startsWith("place"))?.text ?? null;

            const postalCode =
                context.find((c: any) => typeof c.id === "string" && c.id.startsWith("postcode"))?.text ?? null;

            res.json({
                status: mapboxStatus,
                city,
                postalCode,
                address: fullAddress,
            });
        } catch (error) {
            console.error('Mapbox geocoding error:', error);
            res.status(500).json({ error: 'Failed to retrieve address from Mapbox' });
        }
    };
}

export default MapBoxController;

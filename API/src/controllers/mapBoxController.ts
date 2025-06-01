import {NextFunction, Request, RequestHandler, Response} from "express"
import {PrismaClient as PostgresClient} from "../../prisma/client/postgresClient"
import {config} from "../config/env";

const MAPBOX_API_KEY = config.MAPBOX_API_KEY;
const postgresClient = new PostgresClient()

class MapBoxController {

    getNeighborhood: RequestHandler = async (req: Request, res: Response) => {
        const address = req.query.address as string;

        if (!address || address.trim().length === 0) {
            res.status(400).send("Paramètre 'address' manquant ou vide");
            return;
        }

        const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;
        if (!MAPBOX_API_KEY) {
            res.status(500).send("API key Mapbox manquante");
            return;
        }

        try {
            const encodedAddress = encodeURIComponent(address);
            const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodedAddress}&access_token=${MAPBOX_API_KEY}&limit=1`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erreur API Mapbox: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            const feature = data.features?.[0];
            if (!feature) {
                res.status(404).send("Adresse non trouvée");
                return;
            }

            const context = feature.context ?? feature.properties?.context ?? {};

            const district =
                context?.district?.name ??
                context?.locality?.name ??
                context?.neighborhood?.name ??
                context?.place?.name ??
                feature.text ??
                feature.place_name ??
                null;

            res.status(200).json({district});
        } catch (err: any) {
            res.status(500).send(err.message || "Erreur serveur");
        }
    }
}


export default MapBoxController

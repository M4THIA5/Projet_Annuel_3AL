import {Objet} from "#/types/troc"


type Props = {
    user1Name: string;
    user2Name: string;
    user1Items: Objet[];
    user2Items: Objet[];
    onCancel: () => void;
    onConfirm: () => void;
};

export default function TradeConfirmationPage({
                                                  user1Name,
                                                  user2Name,
                                                  user1Items,
                                                  user2Items,
                                                  onCancel,
                                                  onConfirm,
                                              }: Props) {
    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col justify-between">
            <h1 className="text-3xl font-bold text-center mb-8">Confirmation de troc</h1>

            <div className="flex justify-center gap-8 mb-12 flex-wrap">
                {/* Utilisateur 1 */}
                <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
                    <h2 className="text-xl font-semibold mb-4 text-center">Objets de {user1Name}</h2>
                    <ul className="space-y-4">
                        {user1Items.map((item) => (
                            <li key={item.id} className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <img src={item.image} alt={item.nom} className="w-16 h-16 object-cover rounded-md" />
                                <div>
                                    <h3 className="font-bold">{item.nom}</h3>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Utilisateur 2 */}
                <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
                    <h2 className="text-xl font-semibold mb-4 text-center">Objets de {user2Name}</h2>
                    <ul className="space-y-4">
                        {user2Items.map((item) => (
                            <li key={item.id} className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <img src={item.image} alt={item.nom} className="w-16 h-16 object-cover rounded-md" />
                                <div>
                                    <h3 className="font-bold">{item.nom}</h3>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Boutons de confirmation */}
            <div className="flex justify-center gap-6">
                <button
                    onClick={onCancel}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow transition"
                >
                    Annuler
                </button>
                <button
                    onClick={onConfirm}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow transition"
                >
                    Confirmer l'échange
                </button>
            </div>
        </div>
    );
}

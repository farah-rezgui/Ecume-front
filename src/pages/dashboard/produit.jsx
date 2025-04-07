import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Chip,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";

export function Produit() {
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
    const fetchProduits = async () => {
        try {
            const response = await axios.get("http://localhost:5000/prod/getAllProduit");
            if(response.status===200){
                setProduits(response.data.produitList);
            }
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    fetchProduits();
    }, []); 
    console.log(produits);

    if (loading) return <div>Chargement en cours...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
            Liste de produits
            </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
            <thead>
                <tr>
                {["Titre", "Description", "Image", "Prix", "Date création", "Actions"].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                        {el}
                    </Typography>
                    </th>
                ))}
                </tr>
            </thead>
            <tbody>
                {produits.map((produit) => (
                <tr key={produit._id}>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                <Typography variant="small" color="blue-gray" className="font-semibold">
                        {produit.titre}
                    </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                        {produit.description}
                    </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                    {produit.image && (
                        <Avatar src={produit.image} alt={produit.titre} size="sm" variant="rounded" />
                    )}
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                        {produit.prix}
                    </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                        {new Date(produit.createdAt).toLocaleDateString()}
                    </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                    <div className="flex gap-2">
                        <Typography
                        as="a"
                        href="#"
                        className="text-xs font-semibold text-blue-gray-600 hover:text-blue-500"
                        >
                        Modifier
                        </Typography>
                        <Typography
                        as="a"
                href="#"
                        className="text-xs font-semibold text-blue-gray-600 hover:text-red-500"
                        >
                        Supprimer
                        </Typography>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </CardBody>
        </Card>
    </div>
    );
}
export default Produit;
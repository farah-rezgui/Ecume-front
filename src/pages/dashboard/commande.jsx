import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Spinner,
  Alert,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon, ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";

export function Commande() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [commandeToDelete, setCommandeToDelete] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCommandes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("http://localhost:5000/cmd/getAllCommande");
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const responseData = await response.json();
      setApiResponse(responseData); // Stocke la réponse complète pour débogage
      console.log("Réponse complète de l'API:", responseData);

      // Essaye de trouver le tableau de commandes dans la réponse
      const findCommandsArray = (data) => {
        // Si c'est déjà un tableau
        if (Array.isArray(data)) return data;
        
        // Sinon, cherche récursivement un tableau dans les propriétés de l'objet
        for (const key in data) {
          if (Array.isArray(data[key])) {
            return data[key];
          }
          if (typeof data[key] === 'object' && data[key] !== null) {
            const nestedArray = findCommandsArray(data[key]);
            if (nestedArray) return nestedArray;
          }
        }
        return null;
      };

      const commandsArray = findCommandsArray(responseData);

      if (!commandsArray) {
        throw new Error("Impossible de trouver un tableau de commandes dans la réponse de l'API");
      }

      setCommandes(commandsArray);
    } catch (err) {
      console.error("Erreur de récupération:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCommande = async () => {
    if (!commandeToDelete) return;
    
    try {
      setDeleteLoading(true);
      const response = await fetch(`http://localhost:5000/cmd/deleteCommande/${commandeToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Rafraîchir la liste des commandes après suppression
      await fetchCommandes();
      setOpenDeleteDialog(false);
      setCommandeToDelete(null);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteConfirmation = (commande) => {
    setCommandeToDelete(commande);
    setOpenDeleteDialog(true);
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 mx-4">
        <Alert color="red" className="mb-4">
          Erreur: {error}
        </Alert>
        
        {apiResponse && (
          <Card className="mt-4">
            <CardHeader color="blue" variant="gradient" className="mb-4 p-4">
              <Typography variant="h6">Réponse de l'API (pour débogage)</Typography>
            </CardHeader>
            <CardBody>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </CardBody>
          </Card>
        )}
        
        <Button 
          onClick={fetchCommandes} 
          className="mt-4 flex items-center gap-2"
        >
          <ArrowPathIcon className="h-5 w-5" />
          Réessayer
        </Button>
      </div>
    );
  }

  if (!commandes || commandes.length === 0) {
    return (
      <Alert color="blue" className="mx-auto max-w-screen-md mt-8">
        Aucune commande trouvée
      </Alert>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="white" className="mb-8 p-6">
          <Typography variant="h6" color="black">
            Liste des Commandes ({commandes.length})
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Client", "Email", "Téléphone", "Produits", "Total", "Statut", "Date", "Actions"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {commandes.map((commande, key) => {
                const className = `py-3 px-5 ${
                  key === commandes.length - 1 ? "" : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={key}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Avatar 
                          src={`https://ui-avatars.com/api/?name=${commande.client?.name?.charAt(0) || 'C'}&background=random`} 
                          alt={commande.client?.name || 'Client'} 
                          size="sm" 
                          variant="rounded" 
                        />
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-semibold">
                            {commande.client?.name || 'Nom inconnu'}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {commande.client?.address?.city || 'Ville inconnue'}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {commande.client?.email || '-'}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {commande.client?.phone || '-'}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex flex-col">
                        {commande.products?.map((product, index) => (
                          <Typography key={index} className="text-xs font-normal text-blue-gray-500">
                            {product.quantity}x {product.titre || `Produit ${product.productId?.slice(-4) || index+1}`}
                        </Typography>
                        )) || '-'}
                    </div>
                    </td>
                    <td className={className}>
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                        {commande.totalAmount?.toFixed(2) || '0.00'} DT
                    </Typography>
                    </td>
                    <td className={className}>
                    <Chip
                        variant="gradient"
                        color={
                        commande.status === "pending" ? "amber" : 
                        commande.status === "shipped" ? "blue" : 
                        commande.status === "delivered" ? "green" : "gray"
                        }
                        value={commande.status || 'inconnu'}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit capitalize"
                    />
                    </td>
                    <td className={className}>
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                        {commande.createdAt ? new Date(commande.createdAt).toLocaleDateString() : '-'}
                    </Typography>
                    </td>
                    <td className={className}>
                    <div className="flex gap-2">
                        <button 
                        onClick={() => openDeleteConfirmation(commande)}
                        className="p-1 rounded-full hover:bg-red-50 text-red-500"
                        >
                        <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                    </td>
                </tr>
                );
            })}
            </tbody>
        </table>
        </CardBody>
    </Card>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={openDeleteDialog} handler={() => setOpenDeleteDialog(false)}>
        <DialogHeader>Confirmer la suppression</DialogHeader>
        <DialogBody divider>
          Êtes-vous sûr de vouloir supprimer la commande de {commandeToDelete?.client?.name || 'ce client'} ?
          <br />
          <span className="text-red-500">Cette action est irréversible.</span>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenDeleteDialog(false)}
            className="mr-1"
          >
            <span>Annuler</span>
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={handleDeleteCommande}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                <span>Suppression...</span>
              </div>
            ) : (
              <span>Supprimer</span>
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Commande;
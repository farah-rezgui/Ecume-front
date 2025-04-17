import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  DialogHeader
} from "@material-tailwind/react";
import ModifierUser from './ModifierUser';
import AjouterUser from './AjouterUser';

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const[change,setChange]=useState(false);

  const handleChange = ()=> setChange(!change);
  
  const handleOpenAdd = () => setOpenAdd(!openAdd);
  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleOpenDelete = (user) => {
    setUserToDelete(user);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setUserToDelete(null);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/user/getAllUser');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.userList || !Array.isArray(data.userList)) {
        throw new Error("Format de réponse inattendu");
      }

      setUsers(data.userList);
    } catch (err) {
      console.error("Erreur de récupération:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/user/deleteUser/${userToDelete._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      await response.json();
      fetchUsers(); // Rafraîchir la liste des utilisateurs
      handleCloseDelete(); // Fermer le dialogue de confirmation
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [change]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h6">Chargement en cours...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography color="red" variant="h6">
          Erreur: {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Dialogue pour ajouter un utilisateur */}
      <Dialog open={openAdd} handler={handleCloseAdd} size="sm">
        <DialogHeader>Ajouter un nouvel utilisateur</DialogHeader>
        <DialogBody>
          <AjouterUser handleOpen={handleCloseAdd} fetchUsers={fetchUsers}
          changed={handleChange}  />
        </DialogBody>
      </Dialog>

      {/* Dialogue pour modifier un utilisateur */}
      <Dialog open={openEdit} handler={handleCloseEdit} size="sm">
        <DialogHeader>Modifier l'utilisateur</DialogHeader>
        <DialogBody>
          {selectedUser && (
            <ModifierUser 
              user={selectedUser} 
              handleOpenAdd={handleCloseEdit} 
              fetchUsers={fetchUsers} 
            />
          )}
        </DialogBody>
      </Dialog>

      {/* Dialogue de confirmation pour la suppression */}
      <Dialog open={openDelete} handler={handleCloseDelete} size="sm">
        <DialogHeader>Confirmer la suppression</DialogHeader>
        <DialogBody>
          <Typography variant="paragraph">
            Êtes-vous sûr de vouloir supprimer l'utilisateur {userToDelete?.username} ?
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleCloseDelete}
            className="mr-1"
          >
            <span>Annuler</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleDeleteUser}>
            <span>Confirmer</span>
          </Button>
        </DialogFooter>
      </Dialog>

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            Liste des Utilisateurs ({users.length})
          </Typography>
          <Button 
            color="white" 
            size="sm"
            onClick={handleOpenAdd}
          >
            Ajouter un utilisateur
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Utilisateur", "Email", "Rôle", "Statut", "Date de création", "Actions"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, key) => {
                const className = `py-3 px-5 ${
                  key === users.length - 1 ? "" : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={user._id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Avatar 
                          src={`https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                          alt={user.username} 
                          size="sm" 
                          variant="rounded" 
                        />
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-semibold">
                            {user.username}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user.email}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user.isActive !== false ? 'Actif' : 'Inactif'}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex gap-2">
                        <Typography
                          as="button"
                          onClick={() => handleOpenEdit(user)}
                          className="text-xs font-semibold text-blue-gray-600 hover:text-blue-500"
                        >
                          Modifier
                        </Typography>
                        <Typography
                          as="button"
                          onClick={() => handleOpenDelete(user)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800"
                        >
                          Supprimer
                        </Typography>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
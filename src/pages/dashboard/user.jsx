import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/user/getAllUser');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        // Vérifie que data.userList existe et est un tableau
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

    fetchUsers();
  }, []);

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
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Liste des Utilisateurs ({users.length})
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Utilisateur", "Email", "Date de création", "Actions"].map((el) => (
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
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        as="a"
                        href="#"
                        className="text-xs font-semibold text-blue-gray-600 hover:text-blue-500"
                      >
                        Modifier
                      </Typography>
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
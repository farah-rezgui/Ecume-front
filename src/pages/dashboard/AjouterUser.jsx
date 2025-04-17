import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  Alert,
  Select,
  Option,
  Checkbox
} from "@material-tailwind/react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AjouterUser({ handleOpen, fetchUsers , changed}) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    isActive: true
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post('http://localhost:5000/user/addUser', formData);
      
      if (response.status === 200) {
        setSuccess(true);
          handleOpen();
          changed();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Ajouter un nouvel utilisateur
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && <Alert color="red">{error}</Alert>}
            {success && <Alert color="green">Utilisateur ajouté avec succès!</Alert>}

            {/* Champ Nom d'utilisateur */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Nom d'utilisateur*
              </Typography>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                size="lg"
                placeholder="Nom d'utilisateur"
                required
              />
            </div>

            {/* Champ Email */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Email*
              </Typography>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                size="lg"
                placeholder="Email"
                required
              />
            </div>

            {/* Champ Mot de passe */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Mot de passe*
              </Typography>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                size="lg"
                placeholder="Mot de passe"
                required
              />
            </div>

            {/* Champ Rôle */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Rôle*
              </Typography>
              <Select
                name="role"
                value={formData.role}
                onChange={(value) => handleSelectChange('role', value)}
                size="lg"
                label="Sélectionner un rôle"
              >
                <Option value="user">Utilisateur</Option>
                <Option value="admin">Administrateur</Option>
              </Select>
            </div>

            {/* Champ Statut */}
            <div className="flex items-center gap-4">
              <Checkbox
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Typography variant="small" color="blue-gray" className="font-medium">
                Compte actif
              </Typography>
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                variant="outlined"
                color="red"
                onClick={handleOpen}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                color="green"
                disabled={loading}
              >
                {loading ? 'En cours...' : 'Ajouter l\'utilisateur'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
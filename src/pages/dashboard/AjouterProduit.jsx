import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Textarea,
  Button,
  Alert
} from "@material-tailwind/react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AjouterProduit() {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    image: '',
    prix: '',
    quantityStock: 1
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantityStock' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/prod/addProduit', formData);
      
      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard/produit'); // Correction ici
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout du produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Ajouter un nouveau produit
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && <Alert color="red">{error}</Alert>}
            {success && <Alert color="green">Produit ajouté avec succès! Redirection...</Alert>}

            {/* Champ Titre */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Titre du produit
              </Typography>
              <Input
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                size="lg"
                placeholder="Nom du produit"
                required
              />
            </div>

            {/* Champ Description */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Description
              </Typography>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                size="lg"
                placeholder="Description du produit"
                required
              />
            </div>

            {/* Champ Prix */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Prix
              </Typography>
              <Input
                name="prix"
                type="number"
                value={formData.prix}
                onChange={handleChange}
                size="lg"
                placeholder="Prix"
                required
              />
            </div>

            {/* Champ Quantité en stock */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Quantité en stock
              </Typography>
              <Input
                name="quantityStock"
                type="number"
                value={formData.quantityStock}
                onChange={handleChange}
                size="lg"
                placeholder="Quantité disponible"
                min="1"
                required
              />
            </div>

            {/* Champ Image */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                URL de l'image
              </Typography>
              <Input
                name="image"
                value={formData.image}
                onChange={handleChange}
                size="lg"
                placeholder="URL de l'image"
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                variant="outlined"
                color="gray"
                onClick={() => navigate('/dashboard/produit')} 
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                color="gray"
                disabled={loading}
              >
                {loading ? 'En cours...' : 'Ajouter le produit'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
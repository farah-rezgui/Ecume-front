import React, { useState,useRef } from 'react';
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


export default function AjouterProduit({ handleOpen, fetchProduits }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    image:[],
    prix: '',
    quantityStock: 1
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImage = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setFormData(prev => ({
        ...prev,
        image: [...prev.image, ...newImage]
      }));
    }
  };
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
    setSuccess(false);
    const form = new FormData();
    form.append('titre', formData.titre);
    form.append('description', formData.description);
    form.append('prix', formData.prix);
    form.append('quantityStock', formData.quantityStock);
    formData.image.forEach((imgObj) => {
        form.append('image', imgObj.file);
    });

    try {
      const response = await axios.post('http://localhost:5000/prod/addProduit', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        setSuccess(true);
        handleOpen();
        if (typeof fetchProduits === "function") fetchProduits(); 
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
              <Typography variant="small" className="mb-2 font-medium">
                Image du produit
              </Typography>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Typography variant="small" className="mb-4">
                  Télécharger des images
                </Typography>
                <Typography variant="small" className="text-gray-600 mb-4">
                  JPG, PNG ou GIF. Taille max 50MB. Vous pouvez sélectionner plusieurs images.
                </Typography>
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}

                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    color="gray"
                    size="sm"
                    className="cursor-pointer"
                    onClick={handleButtonClick}                  >
                    Sélectionner des fichiers
                  </Button>
                </label>
                
                {/* Aperçu des images */}
                <div className="flex flex-wrap gap-4 mt-4">
                  {formData.image.map((image, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img
                        src={image.preview}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                variant="outlined"
                color="gray"
                onClick={handleOpen}
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
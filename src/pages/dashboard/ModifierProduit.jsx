import React, { useState, useEffect ,useRef } from 'react';
import {
Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Textarea,
  Button,
  Alert ,
} from "@material-tailwind/react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


export default function ModifierProduit({ handleOpenAdd , fetchProduits , produit }) {
  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
    };
  const { _id } = produit;
  console.log(produit);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    quantityStock: 1,
    existingImage: '',
    newImages: []
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Charger les données du produit à modifier
  useEffect(() => {
    const fetchProduit = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/prod/getProduitById/${_id}`);
        if (response.status === 200) {
          setFormData({
            titre: response.data.titre,
            description: response.data.description,
            prix: response.data.prix,
            quantityStock: response.data.quantityStock,
            existingImage: response.data.image || ''
          });
        }
      } catch (err) {
        setError('Erreur lors du chargement du produit');
      }
    };

    fetchProduit();
  }, [_id]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setFormData(prev => ({
        ...prev,
        newImages: [...prev.newImages, ...newImages]
      }));
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.newImages];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      newImages
    }));
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
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titre', formData.titre);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('prix', formData.prix);
      formDataToSend.append('quantityStock', formData.quantityStock);
      
      // Ajouter l'image existante si aucune nouvelle image n'est sélectionnée
      if (formData.newImages?.length === 0 && formData.existingImage) {
        formDataToSend.append('existingImage', formData.existingImage);
      }
      
      // Ajouter les nouvelles images
      formData.newImages?.forEach(image => {
        formDataToSend.append('images', image.file);
      });

      const response = await axios.put(`http://localhost:5000/prod/updateProduit/${_id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 200) {
        setSuccess(true);
        handleOpenAdd();
        setTimeout(() => navigate('/dashboard/produit'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la modification du produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Modifier le produit
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && <Alert color="red">{error}</Alert>}
            {success && <Alert color="green">Produit modifié avec succès!</Alert>}

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
                {/* Afficher l'image existante */}
                {formData.existingImage && formData.newImages.length === 0 && (
                  <div className="mb-4">
                    <Typography variant="small" className="mb-2">
                      Image actuelle
                    </Typography>
                    <img
                      src={formData.existingImage}
                      alt="Image actuelle"
                      className="w-32 h-32 object-cover mx-auto rounded"
                    />
                  </div>
                )}

                <Typography variant="small" className="mb-4">
                {formData.newImages?.length > 0 ? 'Nouvelles images sélectionnées' : 'Télécharger de nouvelles images'}
                </Typography>
                <Typography variant="small" className="text-gray-600 mb-4">
                JPG, PNG ou GIF. Taille max 50MB.
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
                    onClick={handleButtonClick}
                  >
                    Sélectionner des fichiers
                  </Button>
                </label>
                
                {/* Aperçu des nouvelles images */}
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                  {formData.newImages?.map((image, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img
                        src={image.preview}
                        alt={`Nouvelle image ${index}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                variant="outlined"
                color="gray"
                onClick={handleOpenAdd}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                color="gray"
                disabled={loading}
            >
                {loading ? 'En cours...' : 'Enregistrer les modifications'}
            </Button>
            </div>
        </form>
        </CardBody>
    </Card>
    </div>
);
}
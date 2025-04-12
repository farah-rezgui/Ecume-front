import React, { useState, useRef } from 'react';
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
    quantityStock: 1,
    prix: '',
    description: '',
    images: []
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantityStock' ? parseInt(value) : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const validImages = files.filter(file => 
        ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
      );

      if (validImages.length !== files.length) {
        setError('Seuls les formats JPG, PNG et GIF sont acceptés');
        return;
      }

      const newImages = validImages.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      }));
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const validationErrors = [];
      
      if (!formData.titre || !formData.titre.trim()) {
        validationErrors.push('Le nom du produit est requis');
      }
      
      if (!formData.quantityStock || formData.quantityStock < 1) {
        validationErrors.push('La quantité doit être au moins 1');
      }
      
      if (!formData.prix || isNaN(formData.prix) || parseFloat(formData.prix) <= 0) {
        validationErrors.push('Un prix valide est requis');
      }
      
      if (formData.images.length === 0) {
        validationErrors.push('Au moins une image est requise');
      }

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      setShowModal(true);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  const confirmSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titre', formData.titre);
      formDataToSend.append('quantityStock', formData.quantityStock);
      formDataToSend.append('prix', formData.prix);
      formDataToSend.append('description', formData.description);
      
      formData.images.forEach((image) => {
        formDataToSend.append('image', image.file);
      });

      const response = await axios.post('http://localhost:5000/prod/addProduit', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 201) {
        setSuccess(true);
        formData.images.forEach(image => URL.revokeObjectURL(image.preview));
        setTimeout(() => navigate('/dashboard/produit'), 1500);
      }
    } catch (err) {
      console.error('Erreur:', err);
      const errorMessage = err.response?.data?.message || 
                        err.response?.data?.error || 
                        err.message;
      setError(errorMessage || 'Erreur lors de l\'ajout du produit');
    } finally {
      const navigate = useNavigate();
      navigate('/dashboard/produit')
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-8">
      {/* Modale de confirmation */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Confirmer l'ajout
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir ajouter ce produit ?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmSubmit}
                  disabled={loading}
                >
                  {loading ? 'Envoi en cours...' : 'Confirmer'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Ajouter un produit
          </Typography>
        </CardHeader>
        
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <Alert color="red" className="mb-4">
                {error.split('\n').map((line, i) => (
                  <Typography key={i} variant="small" className="font-medium block">
                    {line}
                  </Typography>
                ))}
              </Alert>
            )}
            
            {success && (
              <Alert color="green" className="mb-4">
                Produit ajouté avec succès! Redirection...
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography variant="small" className="mb-2 font-medium">
                  Nom du produit*
                </Typography>
                <Input
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  size="lg"
                  required
                />
              </div>

              <div>
                <Typography variant="small" className="mb-2 font-medium">
                  Quantité en stock*
                </Typography>
                <Input
                  name="quantityStock"
                  type="number"
                  value={formData.quantityStock}
                  onChange={handleChange}
                  size="lg"
                  min="1"
                  required
                />
              </div>

              <div>
                <Typography variant="small" className="mb-2 font-medium">
                  Prix (DT)*
                </Typography>
                <Input
                  name="prix"
                  type="number"
                  value={formData.prix}
                  onChange={handleChange}
                  size="lg"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <Typography variant="small" className="mb-2 font-medium">
                Description
              </Typography>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                size="lg"
                rows={4}
              />
            </div>

            <div>
              <Typography variant="small" className="mb-2 font-medium">
                Image du produit*
              </Typography>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Typography variant="small" className="mb-2">
                  Cliquez pour télécharger une image
                </Typography>
                <Typography variant="small" className="text-gray-600">
                  Formats acceptés: JPG, PNG, GIF
                </Typography>
                
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-center">
                      <img
                        src={formData.images[0].preview}
                        alt="Aperçu"
                        className="h-32 w-32 object-cover rounded"
                      />
                    </div>
                    <Typography variant="small" className="mt-2 text-gray-600">
                      {formData.images[0].name}
                    </Typography>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
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
                disabled={loading || formData.images.length === 0}
              >
                {loading ? 'Validation...' : 'Ajouter le produit'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import api from './api';

const App = () => {
  const [mensagens, setMensagens] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    publicada: true,
  });

  const fetchMensagens = async () => {
    const response = await api.get('/mensagens');
    setMensagens(response.data);
  };

  useEffect(() => {
    fetchMensagens();
  }, []);

  const handleInputChange = (event) => {
    const { name, type, checked, value } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await api.post('/criar', formData);
    fetchMensagens();
    setFormData({
      titulo: '',
      conteudo: '',
      publicada: true,
    });
  };

  return (
    <div>
      <h1>Mensagens</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleInputChange}
          placeholder="Título"
        />
        <textarea
          name="conteudo"
          value={form

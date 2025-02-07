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
    try {
      const response = await api.get('/mensagens');
      setMensagens(response.data);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  useEffect(() => {
    fetchMensagens();
  }, []);

  const handleInputChange = (event) => {
    const { name, type, checked, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/criar', formData);
      fetchMensagens();
      setFormData({ titulo: '', conteudo: '', publicada: true });
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };
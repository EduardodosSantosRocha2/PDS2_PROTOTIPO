import React, { useState, useEffect } from 'react'
import api from './api'
const App = () => {
  const [Mensagens, setMensagens] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    publicada: true
  })
  const fetchMensagens = async () => {
    const response = await api.get('/mensagens')
    setMensagens(response.data)
  };
  useEffect(() => {
    fetchMensagens();
  }, []);
  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value
    });
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await api.post('/criar', formData);
    fetchMensagens();
    setFormData({
      titulo: '',
      conteudo: '',
      publicada: true
    });
  };

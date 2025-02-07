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
          value={formData.conteudo}
          onChange={handleInputChange}
          placeholder="Conteúdo"
        />
        <label>
          Publicada:
          <input
            type="checkbox"
            name="publicada"
            checked={formData.publicada}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Criar</button>
      </form>
      <ul>
        {mensagens.map((mensagem) => (
          <li key={mensagem.id}>{mensagem.titulo}</li>
        ))}
      </ul>
    </div>
  );


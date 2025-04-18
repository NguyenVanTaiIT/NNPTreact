import { useState, useEffect, useCallback } from 'react';
import { getAllServices } from '../services/serviceService';

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllServices();
        if (response.success) {
          const servicesMap = new Map();
          response.data
            .filter(service => service._id !== '67f40fa8d015835f87d8521e')
            .forEach(service => {
              servicesMap.set(service.name.toLowerCase().trim(), {
                _id: service._id,
                name: service.name,
                price: service.price,
                description: service.description,
                status: service.status,
              });
            });
          setServices(Array.from(servicesMap.values()));
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };

    fetchServices();
  }, []);

  const handleServiceChange = useCallback((service, isSelected) => {
    setSelectedServices(prev => {
      if (isSelected) {
        const existing = prev.find(s => s.name.toLowerCase().trim() === service.name.toLowerCase().trim());
        if (existing) {
          return prev.map(s =>
            s.name.toLowerCase().trim() === service.name.toLowerCase().trim()
              ? { ...s, quantity: (s.quantity || 1) + 1, totalPrice: (s.quantity + 1) * s.price }
              : s
          );
        }
        return [...prev, { ...service, quantity: 1, totalPrice: service.price }];
      }
      return prev.filter(s => s.name.toLowerCase().trim() !== service.name.toLowerCase().trim());
    });
  }, []);

  const handleQuantityChange = useCallback((serviceId, quantity) => {
    const newQuantity = parseInt(quantity) || 0;
    setSelectedServices(prev =>
      prev.map(service =>
        service._id === serviceId
          ? { ...service, quantity: newQuantity, totalPrice: service.price * newQuantity }
          : service
      )
    );
  }, []);

  return { services, selectedServices, handleServiceChange, handleQuantityChange };
};
import { useState } from 'react';

const useDataManager = (initialData = []) => {
  const [items, setItems] = useState(initialData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setItems(items.filter(item => item.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedItem) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setItems(
        items.map(item => (item.id === updatedItem.id ? updatedItem : item))
      );
      setSelectedItem(null);
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (newItem) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newId = Math.max(...items.map(item => item.id), 0) + 1;
      setItems([...items, { ...newItem, id: newId }]);
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  const openForm = (item = null) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedItem(null);
    setIsFormOpen(false);
  };

  return {
    items,
    selectedItem,
    isFormOpen,
    loading,
    error,
    handleDelete,
    handleUpdate,
    handleCreate,
    openForm,
    closeForm
  };
};

export default useDataManager; 
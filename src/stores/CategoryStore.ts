import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useAuthStore } from './authStore';
import { useToast } from 'vue-toastification';

export const useCategoryStore = defineStore('category', () => {
  const authStore = useAuthStore();

  const categories = ref<{ id: number; category_name: string }[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function addCategory(category_name: string) {
    loading.value = true;
    error.value = null;

    try {
      if (!authStore.token) throw new Error('No auth token found');
      if (!authStore.getEntityId) throw new Error('No entity ID found');

      const response = await axios.post(
        `inventory/category/add/`,
        {
          category_name,
          entity_id: authStore.getEntityId,
        },
        {
          headers: {
            Authorization: authStore.token,
            'Content-Type': 'application/json',
          },
        }
      );
      // useToast().success("Category Created Successfully!");
      loading.value = false;
      return response.data;
    } catch (err: any) {
      loading.value = false;
      error.value = err.response?.data?.message || err.message || 'Error adding category';
      throw err;
    }
  }

  async function listCategories() {
    loading.value = true;
    error.value = null;

    try {
      if (!authStore.token) throw new Error('No auth token found');
      if (!authStore.getEntityId) throw new Error('No entity ID found');

      const response = await axios.get(
        `inventory/category/list/${authStore.getEntityId}/`,
        {
          headers: {
            Authorization: authStore.token,
          },
        }
      );

      categories.value = response.data.categories || [];
      loading.value = false;
    } catch (err: any) {
      loading.value = false;
      error.value = err.response?.data?.message || err.message || 'Error fetching categories';
      throw err;
    }
  }

  async function deleteCategory(category_id: number) {
    loading.value = true;
    error.value = null;

    try {
      if (!authStore.token) throw new Error('No auth token found');

      await axios.delete(
        `inventory/category/${category_id}/delete/`,
        {
          headers: {
            Authorization: authStore.token,
          },
        }
      );

      categories.value = categories.value.filter(cat => cat.id !== category_id);

      loading.value = false;
    } catch (err: any) {
      loading.value = false;
      error.value = err.response?.data?.message || err.message || 'Error deleting category';
      throw err;
    }
  }

  async function updateCategory(category_id: number, category_name: string) {
    loading.value = true;
    error.value = null;

    try {
      if (!authStore.token) throw new Error('No auth token found');

      const response = await axios.put(
        `inventory/category/${category_id}/update/`,
        { category_name },
        {
          headers: {
            Authorization: authStore.token,
            'Content-Type': 'application/json',
          },
        }
      );

      const index = categories.value.findIndex(cat => cat.id === category_id);
      if (index !== -1) {
        categories.value[index] = { ...categories.value[index], category_name };
      }

      loading.value = false;
      return response.data;
    } catch (err: any) {
      loading.value = false;
      error.value = err.response?.data?.message || err.message || 'Error updating category';
      throw err;
    }
  }

  return {
    categories,
    addCategory,
    listCategories,
    deleteCategory,
    updateCategory,
    loading,
    error,
  };
});

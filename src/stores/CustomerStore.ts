// customerStore.ts
import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';

export interface Customer {
  id?: number; // optional in case not returned
  uuid?: string;
  entity_id?: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  company?: string;
}

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchCustomers() {
    const authStore = useAuthStore();
    loading.value = true;
    error.value = null;

    try {
      if (!authStore.token || !authStore.entity?.id) {
        throw new Error('Authentication data missing.');
      }

      const response = await axios.get(
        `/inventory/customers/list/${authStore.entity.id}`,
        {
          headers: {
            Authorization: authStore.token,
          },
        }
      );

      customers.value = response.data.customer;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || 'Failed to fetch customers.';
      console.error('Error fetching customers:', err);
    } finally {
      loading.value = false;
    }
  }

  async function createCustomer(newCustomer: Partial<Customer>) {
    const authStore = useAuthStore();
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.post(
        '/inventory/customers/add/',
        newCustomer,
        {
          headers: {
            Authorization: authStore.token,
          },
        }
      );
      await fetchCustomers(); 
      return response;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || 'Failed to create customer.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateCustomer(uuid: string, updatedData: Partial<Customer>) {
    const authStore = useAuthStore();
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.put(
        `/inventory/customers/${uuid}/`,
        updatedData,
        {
          headers: {
            Authorization: authStore.token,
          },
        }
      );

      await fetchCustomers(); 
      return response;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || 'Failed to update customer.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteCustomer(uuid: string) {
    const authStore = useAuthStore();
    loading.value = true;
    error.value = null;

    try {
      await axios.delete(`/inventory/customers/${uuid}/`, {
        headers: {
          Authorization: authStore.token,
        },
      });

      customers.value = customers.value.filter((c) => c.uuid !== uuid);
    } catch (err: any) {
      error.value =
        err.response?.data?.message || 'Failed to delete customer.';
      console.error('Error deleting customer:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
});

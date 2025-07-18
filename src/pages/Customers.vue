<script setup lang="ts">
    import { ref, onMounted } from "vue";
    import { useCustomerStore } from "@/stores/CustomerStore";
    import { useAuthStore } from "@/stores/authStore";
    import { Trash2, UserPen } from "lucide-vue-next";
    import { useToast } from "vue-toastification";

    import BaseBtn from "@/components/BaseBtn.vue";
    import AddCustomerModal from "@/modules/AddCustomerModal.vue";
    import type { Customer } from "@/stores/CustomerStore";

    const customerStore = useCustomerStore();
    const authStore = useAuthStore();

    onMounted(() => {
        customerStore.fetchCustomers();
    });

    const showModal = ref(false);
    const selectedCustomer = ref<Customer | null>(null);

    function openModal(customer: Customer | null = null) {
        selectedCustomer.value = customer;
        showModal.value = true;
    }

    function closeModal() {
        showModal.value = false;
        selectedCustomer.value = null;
    }

    async function deleteCustomer(customer: Customer) {
        if (!customer.uuid) return;

        const confirmed = confirm(
            `Are you sure you want to delete ${customer.name}?`
        );
        if (!confirmed) return;

        try {
            await customerStore.deleteCustomer(customer.uuid);
            useToast().success("Customer deleted successfully");
        } catch (err) {
            useToast().error("Failed to delete customer.");
        }
    }
</script>

<template>
    <div class="bg-gray-100 min-h-full p-4">
        <div
            class="max-w-6xl mx-auto pt-24 flex gap-6 trucate justify-between items-center px-4"
        >
            <h1 class="text-xl text-gray-900 font-bold">CUSTOMERS</h1>
            <BaseBtn
                class="bg-gray-600 hover:bg-gray-800 px-4 py-2 rounded-lg text-white font-semibold transition duration-200"
                @click="openModal()"
            >
                Add Cust...
            </BaseBtn>
        </div>

        <!-- Modal -->
        <AddCustomerModal
            :show="showModal"
            :customer="selectedCustomer"
            @close="closeModal"
        />

        <div class="mt-6 overflow-x-auto max-w-6xl mx-auto px-3">
            <table class="min-w-full min-h-full bg-white shadow rounded-lg">
                <thead>
                    <tr
                        class="bg-gray-200 min-h-full text-left text-sm font-semibold text-gray-700"
                    >
                        <th class="px-4 py-2 trucate">Name</th>
                        <th class="px-4 py-2 trucate">Email</th>
                        <th class="px-4 py-2 trucate">Phone Number</th>
                        <th class="px-4 py-2 trucate">Address</th>
                        <th class="px-4 py-2 trucate">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="customer in customerStore.customers"
                        :key="customer.uuid"
                        class="border-t border-gray-200 hover:bg-gray-50 hover:shadow-md transition"
                    >
                        <td class="px-4 py-2 text-sm text-gray-900 truncate">
                            {{ customer.name }}
                        </td>
                        <td class="px-4 py-2 text-sm text-gray-700 truncate">
                            {{ customer.email }}
                        </td>
                        <td class="px-4 py-2 text-sm text-gray-700 truncate">
                            {{ customer.phone_number }}
                        </td>
                        <td class="px-4 py-2 text-sm text-gray-700 truncate">
                            {{ customer.address }}
                        </td>
                        <td class="px-4 py-2 text-sm">
                            <div class="flex gap-2 items-center">
                                <BaseBtn
                                    class="p-2"
                                    @click.stop.prevent="openModal(customer)"
                                >
                                    <UserPen class="w-5 h-5 text-blue-600" />
                                </BaseBtn>
                                <BaseBtn
                                    class="p-2"
                                    @click.stop.prevent="
                                        deleteCustomer(customer)
                                    "
                                >
                                    <Trash2 class="w-5 h-5 text-red-600" />
                                </BaseBtn>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

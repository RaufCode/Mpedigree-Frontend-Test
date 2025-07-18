<script setup lang="ts">
    import { computed, onMounted } from "vue";
    import { useCategoryStore } from "@/stores/CategoryStore";
    import { useCustomerStore } from "@/stores/CustomerStore";

    const categoryStore = useCategoryStore();
    const customerStore = useCustomerStore();

    onMounted(() => {
        categoryStore.listCategories();
        customerStore.fetchCustomers();
    });

    const totalCategories = computed(() => categoryStore.categories.length);
    const totalCustomers = computed(() => customerStore.customers.length);
</script>

<template>
    <div class="py-4 max-w-6xl mx-auto px-4">
        <h2 class="text-2xl lg:text-3xl font-bold mb-2 pt-14">Overview</h2>
        <p class="text-gray-600">Here is your dashboard overview.</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div class="p-4 rounded-lg shadow hover:shadow-md">
                <h3 class="text-lg font-semibold">Total Customers</h3>
                <p class="text-xl">{{ totalCustomers }}</p>
            </div>
            <div class="p-4 rounded-lg shadow hover:shadow-md">
                <h3 class="text-lg font-semibold">Total Categories</h3>
                <p class="text-xl">{{ totalCategories }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref, computed } from "vue";
    import BaseBtn from "@/components/BaseBtn.vue";
    import CategoryModal from "@/modules/CategoryModal.vue";
    import { useCategoryStore } from "@/stores/CategoryStore";
    import { useToast } from "vue-toastification";
    import { Trash2, UserPen } from "lucide-vue-next";
    import Spinner from "@/components/Spinner.vue"; // assumed import

    const categoryStore = useCategoryStore();
    const toast = useToast();

    const showModal = ref(false);
    const editingCategory = ref<{ id: number; category_name: string } | null>(
        null
    );
    const isButtonDisabled = ref(false);

    // Derived check for empty state
    const isEmpty = computed(() => categoryStore.categories.length === 0);

    onMounted(() => {
        categoryStore.listCategories();
    });

    function openModal() {
        editingCategory.value = null;
        showModal.value = true;
    }

    function openEditModal(category: { id: number; category_name: string }) {
        editingCategory.value = category;
        showModal.value = true;
    }

    function closeModal() {
        showModal.value = false;
        editingCategory.value = null;
    }

    async function handleSubmit(payload: {
        id?: number;
        category_name: string;
    }) {
        try {
            isButtonDisabled.value = true;

            if (payload.id) {
                await categoryStore.updateCategory(
                    payload.id,
                    payload.category_name
                );
                // toast.success("Category updated successfully");
            } else {
                await categoryStore.addCategory(payload.category_name);
                toast.success("Category added successfully");
            }

            await categoryStore.listCategories();
            closeModal();
        } catch (err) {
            toast.error("Failed to save category");
        } finally {
            setTimeout(() => {
                isButtonDisabled.value = false;
            }, 5000);
        }
    }

    async function handleDelete(category_id: number) {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            await categoryStore.deleteCategory(category_id);
            toast.success("Category deleted successfully");
            await categoryStore.listCategories();
        } catch (err) {
            toast.error("Failed to delete category");
        }
    }
</script>

<template>
    <div class="bg-gray-100 w-full min-h-screen pb-10">
        <div
            class="pt-24 flex justify-between items-center max-w-6xl mx-auto px-4"
        >
            <h1 class="text-xl text-gray-900 font-bold">CATEGORIES</h1>
            <BaseBtn
                class="bg-gray-600 hover:bg-gray-800 px-4 py-2 rounded-lg text-white font-semibold transition duration-200"
                :disabled="isButtonDisabled"
                @click="openModal"
            >
                Add Category
            </BaseBtn>
        </div>

        <CategoryModal
            :show="showModal"
            :initialName="editingCategory?.category_name || ''"
            :categoryId="editingCategory?.id || null"
            @close="closeModal"
            @submit="handleSubmit"
        />

        <!-- Optional Spinner: show only when loading -->
        <!-- <Spinner v-if="categoryStore.loading" class="my-8" /> -->

        <div
            v-if="!isEmpty"
            class="mt-6 overflow-x-auto max-w-6xl mx-auto px-4"
        >
            <table class="min-w-full bg-white shadow rounded-lg">
                <thead>
                    <tr
                        class="bg-gray-200 text-left text-sm font-semibold text-gray-700"
                    >
                        <th class="px-4 py-2">Category Name</th>
                        <th class="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="category in categoryStore.categories"
                        :key="category.id"
                        class="border-t border-gray-200 hover:bg-gray-50 hover:shadow-md transition"
                    >
                        <td class="px-4 py-2 text-sm text-gray-900 truncate">
                            {{ category.category_name }}
                        </td>
                        <td class="px-4 py-2 text-sm text-gray-900 truncate">
                            <div class="flex gap-6 items-center">
                                <BaseBtn
                                    class="p-2"
                                    @click="openEditModal(category)"
                                >
                                    <UserPen class="w-5 h-5 text-blue-600" />
                                </BaseBtn>
                                <BaseBtn
                                    class="p-2"
                                    @click="handleDelete(category.id)"
                                >
                                    <Trash2 class="w-5 h-5 text-red-600" />
                                </BaseBtn>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div
            v-else
            class="text-center text-gray-700 text-lg font-semibold py-10"
        >
            No Categories Available
        </div>
    </div>
</template>

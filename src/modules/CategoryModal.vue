<script setup lang="ts">
    import { ref, watch } from "vue";
    import BaseInput from "@/components/BaseInput.vue";
    import BaseBtn from "@/components/BaseBtn.vue";

    const props = defineProps<{
        show: boolean;
        initialName?: string;
        categoryId?: number | null;
    }>();

    const emit = defineEmits<{
        (e: "close"): void;
        (e: "submit", payload: { id?: number; category_name: string }): void;
    }>();

    const form = ref<{ category_name: string }>({ category_name: "" });
    const localError = ref<string | null>(null);

    watch(
        () => props.show,
        (newVal) => {
            if (newVal) {
                form.value.category_name = props.initialName || "";
                localError.value = null;
            }
        }
    );

    function handleClose() {
        emit("close");
        form.value.category_name = "";
        localError.value = null;
    }

    function handleSubmit() {
        localError.value = null;
        if (!form.value.category_name.trim()) {
            localError.value = "Category name is required.";
            return;
        }
        emit("submit", {
            id: props.categoryId ?? undefined,
            category_name: form.value.category_name.trim(),
        });
        handleClose();
    }
</script>

<template>
    <transition name="fade">
        <div
            v-if="show"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            @click.self="handleClose"
        >
            <div
                class="bg-white w-full max-w-md rounded-lg p-6 shadow-lg animate-fadeIn"
            >
                <h1 class="text-xl font-semibold mb-4">
                    {{ props.categoryId ? "Edit Category" : "Add Category" }}
                </h1>

                <form @submit.prevent="handleSubmit">
                    <BaseInput
                        label="Category Name"
                        type="text"
                        v-model="form.category_name"
                        required
                    />

                    <BaseBtn
                        class="bg-gray-600 hover:bg-gray-800 px-4 py-2 rounded-lg text-white font-semibold transition duration-200 block mx-auto mt-4 cursor-pointer"
                    >
                        {{ props.categoryId ? "Update" : "Submit" }}
                    </BaseBtn>
                </form>

                <p v-if="localError" class="text-red-600 mt-4">
                    {{ localError }}
                </p>
            </div>
        </div>
    </transition>
</template>

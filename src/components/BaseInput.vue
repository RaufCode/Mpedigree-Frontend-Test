<script setup lang="ts">
    const props = defineProps<{
        label?: string;
        type: string;
        placeholder?: string;
        required?: boolean;
        modelValue?: string;
    }>();

    const emit = defineEmits<{
        (e: "update:modelValue", value: string): void;
    }>();

    const updateValue = (e: Event) => {
        const target = e.target as HTMLInputElement;
        emit("update:modelValue", target.value);
    };
</script>

<template>
    <label class="block w-full mb-2">
        <span class="block text-sm font-medium text-gray-700 mb-1">
            {{ props.label }}
        </span>
        <input
            :type="props.type"
            :placeholder="props.placeholder"
            :required="props.required"
            :value="props.modelValue"
            @input="updateValue"
            class="w-full block px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none transition"
        />
    </label>
</template>

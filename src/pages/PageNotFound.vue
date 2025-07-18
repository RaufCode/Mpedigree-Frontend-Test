<script setup lang="ts">
    import { AlertTriangle } from "lucide-vue-next";

    defineProps<{
        statusCode?: number;
        message?: string;
    }>();
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="text-center max-w-md">
            <AlertTriangle class="mx-auto h-16 w-16 text-red-500" />
            <h1 class="text-3xl font-semibold mt-6 text-gray-800">
                Error Page Not Found
            </h1>
            <p class="text-gray-600 mt-2 text-base">
                {{ "Something went wrong. Please try again later." }}
            </p>

            <div class="mt-6">
                <slot>
                    <router-link
                        to="/"
                        class="inline-block bg-primary-600 hover:bg-primary-700 font-semibold border-2 border-gray-200 text-blue-400 px-5 py-2 rounded-xl transition hover:bg-gray-200 cursor-pointer"
                    >
                        Back to Home
                    </router-link>
                </slot>
            </div>
        </div>
    </div>
</template>

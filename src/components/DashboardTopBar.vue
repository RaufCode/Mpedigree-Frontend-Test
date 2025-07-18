<script setup lang="ts">
    import { useAuthStore } from "@/stores/authStore";
    import { AlignLeft } from "lucide-vue-next";
    const authStore = useAuthStore();
    // const user = authStore.individual;
</script>

<template>
    <header
        class="h-16 flex items-center justify-between px-4 bg-white border-b fixed top-0 w-full z-30 lg:ml-64"
    >
        <button class="lg:hidden" @click="$emit('toggleSidebar')">
            <AlignLeft class="w-5 h-5" />
        </button>
        <h1 class="text-xl text-gray-900 font-semibold ml-10">Dashboard</h1>
    </header>
</template>

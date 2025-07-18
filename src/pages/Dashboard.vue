<script setup lang="ts">
    import { ref, watch, onMounted } from "vue";
    import DashboardSideBar from "@/components/DashboardSideBar.vue";
    import DashboardTopBar from "@/components/DashboardTopBar.vue";
    import Customers from "./Customers.vue";
    import Overview from "./Overview.vue";
    import Categories from "./Categories.vue";

    const isSidebarOpen = ref(false);
    const content = ref("overview");

    // Load saved view from localStorage on mount
    onMounted(() => {
        const savedView = localStorage.getItem("active-view");
        if (savedView) {
            content.value = savedView;
        }
    });

    // Watch and store view changes in localStorage
    watch(content, (newView) => {
        localStorage.setItem("active-view", newView);
    });

    function setView(view: string) {
        content.value = view;
    }
</script>

<template>
    <div>
        <DashboardSideBar
            v-model:isOpen="isSidebarOpen"
            @view-change="setView"
        />
        <DashboardTopBar @toggleSidebar="isSidebarOpen = !isSidebarOpen" />

        <div>
            <main class="lg:pl-64 min-h-screen bg-gray-50">
                <Overview v-if="content === 'overview'" />
                <Customers v-if="content === 'customer'" />
                <Categories v-if="content === 'category'" />
            </main>
        </div>
    </div>
</template>

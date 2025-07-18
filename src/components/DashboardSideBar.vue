<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from "vue";
    import { useAuthStore } from "@/stores/authStore";
    import { useRouter } from "vue-router";
    import { House, UsersRound, Logs, LogIn } from "lucide-vue-next";

    // model from parent
    const isOpen = defineModel<boolean>("isOpen", { required: true });

    const emit = defineEmits<{
        (e: "view-change", view: string): void;
        (e: "update:isOpen", value: boolean): void;
    }>();

    const authStore = useAuthStore();
    const router = useRouter();

    const isLargeScreen = ref(window.innerWidth >= 1024);
    const activeView = ref(localStorage.getItem("active-view") || "overview");

    function updateScreenSize() {
        isLargeScreen.value = window.innerWidth >= 1024;
    }

    onMounted(() => {
        window.addEventListener("resize", updateScreenSize);
    });

    onBeforeUnmount(() => {
        window.removeEventListener("resize", updateScreenSize);
    });

    function logout() {
        authStore.logout();
        router.push({ name: "signin" });
    }

    // Handle view change and close hamburger
    function handleViewChange(view: string) {
        activeView.value = view;
        localStorage.setItem("active-view", view);
        emit("view-change", view);
        emit("update:isOpen", false);
    }
</script>

<template>
    <transition name="fade">
        <aside
            v-if="isOpen || isLargeScreen"
            class="fixed z-50 inset-y-0 left-0 w-64 bg-gray-900 px-2 py-8 shadow-md"
        >
            <nav class="space-y-4">
                <button
                    @click="handleViewChange('overview')"
                    class="flex items-center gap-3 py-2 px-6 rounded-lg w-full"
                    :class="{
                        'bg-gray-700 text-white': activeView === 'overview',
                        'text-white hover:bg-gray-600':
                            activeView !== 'overview',
                    }"
                >
                    <House class="w-5 h-5" />
                    Dashboard
                </button>

                <button
                    @click="handleViewChange('customer')"
                    class="flex items-center gap-3 py-2 px-6 rounded-lg w-full"
                    :class="{
                        'bg-gray-700 text-white': activeView === 'customer',
                        'text-white hover:bg-gray-600':
                            activeView !== 'customer',
                    }"
                >
                    <UsersRound class="w-5 h-5" />
                    Customer
                </button>

                <button
                    @click="handleViewChange('category')"
                    class="flex items-center gap-3 py-2 px-6 rounded-lg w-full"
                    :class="{
                        'bg-gray-700 text-white': activeView === 'category',
                        'text-white hover:bg-gray-600':
                            activeView !== 'category',
                    }"
                >
                    <Logs class="w-5 h-5" />
                    Category
                </button>

                <button
                    @click="logout"
                    class="flex items-center gap-3 text-white hover:bg-gray-600 py-2 px-6 rounded-lg w-full"
                >
                    <LogIn class="w-5 h-5" />
                    Logout
                </button>
            </nav>
        </aside>
    </transition>

    <!-- Mobile overlay -->
    <div
        v-if="isOpen && !isLargeScreen"
        @click="emit('update:isOpen', false)"
        class="lg:hidden fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm"
    ></div>
</template>

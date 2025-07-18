<script setup lang="ts">
    import { reactive, ref, computed } from "vue";
    import BaseInput from "@/components/BaseInput.vue";
    import BaseBtn from "@/components/BaseBtn.vue";
    import { useAuthStore } from "@/stores/authStore";
    import { useToast } from "vue-toastification";
    import { LockKeyhole, Loader2 } from "lucide-vue-next";

    const authStore = useAuthStore();
    const toast = useToast();

    const form = reactive({
        email: "",
        password: "",
    });

    const loading = ref(false);
    const isFormValid = computed(() => form.email && form.password);

    const submitForm = async () => {
        loading.value = true;
        try {
            await authStore.signIn(form);
            toast.success("Successfully logged in!");
        } catch (error) {
            toast.error("Invalid credentials");
        } finally {
            setTimeout(() => {
                loading.value = false;
            }, 5000);
        }
    };
</script>

<template>
    <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div class="w-full max-w-md">
            <div class="text-center mb-8">
                <div
                    class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg"
                >
                    <LockKeyhole class="w-8 h-8 text-white" />
                </div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    Welcome Back
                </h1>
                <p class="text-gray-600">Sign in to your account</p>
            </div>

            <form
                class="bg-white p-4 md:p-8 rounded-2xl shadow-xl border border-gray-200 relative"
                @submit.prevent="submitForm"
            >
                <div class="space-y-6">
                    <BaseInput
                        label="Email"
                        type="email"
                        v-model="form.email"
                        :required="true"
                        class="transition-all duration-200 focus-within:scale-[1.02]"
                    />
                    <BaseInput
                        label="Password"
                        type="password"
                        v-model="form.password"
                        :required="true"
                        class="transition-all duration-200 focus-within:scale-[1.02]"
                    />
                </div>

                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                        Don't have an account?
                        <router-link
                            to="/signup"
                            class="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 underline underline-offset-4"
                        >
                            Sign up
                        </router-link>
                    </p>
                </div>

                <BaseBtn
                    :class="[
                        'w-full mt-8 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-500/50 relative overflow-hidden',
                        !isFormValid || loading
                            ? 'bg-gray-400 cursor-not-allowed shadow-sm'
                            : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] shadow-md',
                    ]"
                    :disabled="!isFormValid || loading"
                >
                    <div
                        v-if="loading"
                        class="absolute inset-0 flex items-center justify-center"
                    >
                        <Loader2 class="w-5 h-5 text-white animate-spin" />
                    </div>
                    <span :class="{ 'opacity-0': loading }">
                        {{ loading ? "Signing in..." : "Sign In" }}
                    </span>
                </BaseBtn>
            </form>

            <div class="mt-8 text-center">
                <p class="text-xs text-gray-500">
                    Protected by industry-standard security
                </p>
            </div>
        </div>
    </div>
</template>

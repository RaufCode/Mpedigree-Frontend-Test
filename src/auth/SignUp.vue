<script setup lang="ts">
    import { reactive, ref, computed, onMounted } from "vue";
    import BaseBtn from "@/components/BaseBtn.vue";
    import BaseInput from "@/components/BaseInput.vue";
    import { useAuthStore } from "@/stores/authStore";
    import axios from "axios";
    import { useToast } from "vue-toastification";
    import { Loader2 } from "lucide-vue-next";

    const authStore = useAuthStore();
    const toast = useToast();
    const markets = ref<any[]>([]);
    const loading = ref(false);

    onMounted(async () => {
        try {
            const res = await axios.get("/market");
            markets.value = res.data;
        } catch (err) {
            toast.error("Failed to load markets");
        }
    });

    const form = reactive({
        name: "",
        type: "",
        market: "",
        address: "",
        admin_first_name: "",
        admin_last_name: "",
        admin_other_names: "",
        admin_phone: "",
        admin_password: "",
        admin_email: "",
    });

    const isFormValid = computed(() =>
        Object.entries(form).every(([key, val]) =>
            key === "admin_other_names" ? true : Boolean(val)
        )
    );

    const submitForm = async () => {
        loading.value = true;
        try {
            await authStore.signUp(form);
            toast.success("Successfully signed up!");
        } catch (error) {
            toast.error("Invalid credentials");
        } finally {
            setTimeout(() => (loading.value = false), 5000);
        }
    };
</script>

<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <form
            @submit.prevent="submitForm"
            class="bg-white rounded-2xl shadow-lg p-4 md:p-8 w-full max-w-4xl"
        >
            <h1 class="text-2xl font-semibold text-center text-gray-800 mb-6">
                Create an Account
            </h1>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <BaseInput
                    label="First Name"
                    type="text"
                    v-model="form.admin_first_name"
                    required
                />
                <BaseInput
                    label="Last Name"
                    type="text"
                    v-model="form.admin_last_name"
                    required
                />
                <BaseInput
                    label="Other Name"
                    type="text"
                    v-model="form.admin_other_names"
                />
                <BaseInput
                    label="Address"
                    type="text"
                    v-model="form.address"
                    required
                />
                <BaseInput
                    label="Phone"
                    type="tel"
                    v-model="form.admin_phone"
                    required
                />
                <BaseInput
                    label="Email"
                    type="email"
                    v-model="form.admin_email"
                    required
                />
                <BaseInput
                    label="Name of Entity"
                    type="text"
                    v-model="form.name"
                    required
                />

                <label class="block">
                    <span class="text-sm font-medium text-gray-700">Type</span>
                    <select
                        v-model="form.type"
                        required
                        class="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="" disabled>Select Type</option>
                        <option value="Agency">Agency</option>
                        <option value="Organisation">Organisation</option>
                    </select>
                </label>

                <label class="block">
                    <span class="text-sm font-medium text-gray-700"
                        >Market</span
                    >
                    <select
                        v-model="form.market"
                        required
                        class="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="" disabled>Select Market</option>
                        <option
                            v-for="market in markets"
                            :key="market.id"
                            :value="market.id"
                        >
                            {{ market.name }}
                        </option>
                    </select>
                </label>

                <BaseInput
                    label="Password"
                    type="password"
                    v-model="form.admin_password"
                    required
                />
            </div>

            <p class="mt-4 text-sm text-gray-600 text-center">
                Already have an account?
                <router-link
                    to="/signin"
                    class="text-green-600 hover:underline"
                >
                    Sign in
                </router-link>
            </p>

            <BaseBtn
                :disabled="!isFormValid || loading"
                class="mt-6 w-full py-3 px-4 rounded-xl font-semibold relative flex items-center justify-center text-white transition duration-200"
                :class="
                    loading || !isFormValid
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                "
            >
                <Loader2
                    v-if="loading"
                    class="absolute left-4 h-5 w-5 animate-spin text-white"
                />
                <span :class="{ 'opacity-50': loading }">
                    {{ loading ? "Signing up..." : "Sign Up" }}
                </span>
            </BaseBtn>
        </form>
    </div>
</template>

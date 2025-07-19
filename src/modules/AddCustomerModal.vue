<script setup lang="ts">
    import { ref, reactive, watch, computed } from "vue";
    import { useAuthStore } from "@/stores/authStore";
    import { useCustomerStore } from "@/stores/CustomerStore";
    import BaseInput from "@/components/BaseInput.vue";
    import BaseBtn from "@/components/BaseBtn.vue";

    const authStore = useAuthStore();
    const customerStore = useCustomerStore();

    const props = defineProps<{
        show: boolean;
        customer: {
            uuid?: string;
            name: string;
            email: string;
            phone_number: string;
            address: string;
        } | null;
    }>();

    const emit = defineEmits<{
        (e: "close"): void;
    }>();

    function handleClose() {
        emit("close");
    }

    const newCustomer = reactive({
        name: "",
        email: "",
        phone_number: "",
        address: "",
        entity_id: authStore.entity?.id || null,
    });

    watch(
        () => props.customer,
        (customer) => {
            if (customer) {
                newCustomer.name = customer.name;
                newCustomer.email = customer.email;
                newCustomer.phone_number = customer.phone_number;
                newCustomer.address = customer.address;
            } else {
                newCustomer.name = "";
                newCustomer.email = "";
                newCustomer.phone_number = "";
                newCustomer.address = "";
            }
        },
        { immediate: true }
    );

    const isEdit = computed(() => !!props.customer?.uuid);

    const handleSubmit = async () => {
        try {
            if (isEdit.value && props.customer?.uuid) {
                await customerStore.updateCustomer(
                    props.customer.uuid,
                    newCustomer
                );
            } else {
                await customerStore.createCustomer(newCustomer);
            }
            handleClose();
        } catch (error) {
            console.error("Error submitting customer form:", error);
        }
    };
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
                    {{ isEdit ? "Edit Customer" : "Add New Customer" }}
                </h1>

                <form @submit.prevent="handleSubmit">
                    <div class="space-y-3">
                        <BaseInput
                            label="Full Name"
                            type="text"
                            v-model="newCustomer.name"
                        />
                        <BaseInput
                            label="Email"
                            type="email"
                            placeholder="Email"
                            v-model="newCustomer.email"
                        />
                        <BaseInput
                            label="Phone Number"
                            type="text"
                            placeholder="Phone Number"
                            v-model="newCustomer.phone_number"
                        />
                        <BaseInput
                            label="Address"
                            type="text"
                            placeholder="Address"
                            v-model="newCustomer.address"
                        />
                    </div>

                    <BaseBtn
                        class="bg-gray-600 hover:bg-gray-800 px-4 py-2 rounded-lg text-white font-semibold transition duration-200 block mx-auto mt-4 cursor-pointer"
                    >
                        {{ isEdit ? "Update Customer" : "Add Customer" }}
                    </BaseBtn>
                </form>
            </div>
        </div>
    </transition>
</template>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.2s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>

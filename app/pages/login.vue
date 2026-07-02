<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

definePageMeta({
    middleware: "guest",
});

const supabase = useSupabaseClient();
const redirectInfo = useSupabaseCookieRedirect();

const fields: AuthFormField[] = [
    {
        name: "email",
        type: "email",
        label: "Email",
        placeholder: "you@example.com",
        required: true,
    },
    {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        required: true,
    },
];

const schema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

type Schema = z.output<typeof schema>;

const loading = ref(false);
const errorMessage = ref("");

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Unable to log in.";
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    errorMessage.value = "";
    try {
        loading.value = true;
        const { error } = await supabase.auth.signInWithPassword({
            email: event.data.email,
            password: event.data.password,
        });
        if (error) throw error;

        const redirectPath = redirectInfo.pluck();
        await navigateTo(redirectPath || "/");
    } catch (error) {
        errorMessage.value = getErrorMessage(error);
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="flex min-h-dvh items-center justify-center px-4 py-10">
        <UPageCard class="w-full max-w-md">
            <UAuthForm
                :schema="schema"
                :fields="fields"
                title="Log in"
                description="Welcome back. Enter your account details to continue."
                icon="i-lucide-lock"
                :submit="{ label: 'Log in', block: true, loading }"
                @submit="onSubmit"
            >
                <template #validation>
                    <UAlert
                        v-if="errorMessage"
                        :description="errorMessage"
                        title="Unable to log in"
                        color="error"
                        icon="i-lucide-alert-circle"
                        :close="{
                            onClick: () => {
                                errorMessage = '';
                            },
                        }"
                    />
                </template>
                <template #footer>
                    Don't have an account?
                    <ULink to="/signup" class="text-primary font-medium"
                        >Sign up</ULink
                    >.
                </template>
            </UAuthForm>
        </UPageCard>
    </div>
</template>

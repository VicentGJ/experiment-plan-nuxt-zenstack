<script setup lang="ts">
const supabase = useSupabaseClient();
const loading = ref(false);
const errorMessage = ref("");
const { data: user, error: userError } = await useFetch("/api/me", {
    headers: useRequestHeaders(["cookie"]),
});

async function signOut() {
    try {
        loading.value = true;
        errorMessage.value = "";
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        await navigateTo("/login");
    } catch (error) {
        errorMessage.value =
            error instanceof Error ? error.message : "Unable to sign out.";
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div
        class="flex min-h-dvh items-center justify-center bg-elevated px-4 py-10"
    >
        <UCard
            class="w-full max-w-xl text-center"
            title="You're signed in"
            :description="user?.email ?? 'App user is active.'"
        >
            <p v-if="user?.name" class="text-default">
                {{ user.name }}
            </p>
            <p v-if="userError" class="text-sm text-error">
                {{ userError.statusMessage ?? "Unable to load app user." }}
            </p>
            <p v-else-if="errorMessage" class="text-sm text-error">
                {{ errorMessage }}
            </p>

            <template #footer>
                <div class="flex justify-center">
                    <UButton
                        color="error"
                        variant="solid"
                        :loading="loading"
                        @click="signOut"
                    >
                        Sign out
                    </UButton>
                </div>
            </template>
        </UCard>
    </div>
</template>

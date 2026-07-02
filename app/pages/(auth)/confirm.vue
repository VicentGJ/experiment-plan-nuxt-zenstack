<script setup lang="ts">
import { watch } from "vue";

const user = useSupabaseUser();
const redirectInfo = useSupabaseCookieRedirect();

watch(
    user,
    () => {
        if (user.value) {
            const path = redirectInfo.pluck();
            navigateTo(path || "/");
        }
    },
    { immediate: true },
);
</script>

<template>
    <div class="flex min-h-dvh items-center justify-center px-4 py-10">
        <UCard
            class="w-full max-w-md"
            title="Confirming sign in"
            description="Please wait while Supabase finishes your session."
        >
            <div class="flex justify-center py-4">
                <UIcon
                    name="i-lucide-loader-circle"
                    class="size-6 animate-spin text-muted"
                />
            </div>
        </UCard>
    </div>
</template>

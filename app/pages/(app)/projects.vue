<script setup lang="ts">
const { data: user, error: userError } = await useFetch("/api/me", {
    headers: useRequestHeaders(["cookie"]),
});
</script>

<template>
    <UContainer class="space-y-6 py-6">
        <UAlert
            v-if="userError"
            color="error"
            icon="i-lucide-alert-circle"
            title="Unable to load your profile"
            :description="userError.statusMessage ?? 'Try signing in again.'"
        />

        <div v-else class="space-y-1">
            <p class="text-sm text-muted">Welcome back</p>
            <h1 class="text-2xl font-semibold text-highlighted">
                {{ user?.name }}
            </h1>
            <p class="text-sm text-muted">{{ user?.email }}</p>
        </div>

        <UEmpty
            icon="i-lucide-folder-kanban"
            title="No projects yet"
            description="Create your first project to start shaping issues, workflow states, and boards."
            :actions="[
                {
                    label: 'Create project',
                    icon: 'i-lucide-plus',
                    disabled: true,
                },
            ]"
        />
    </UContainer>
</template>

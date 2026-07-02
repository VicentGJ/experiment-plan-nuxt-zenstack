<script setup lang="ts">
import type { BreadcrumbItem, DropdownMenuItem } from "@nuxt/ui";

const route = useRoute();
const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();
const colorMode = useColorMode();
const loading = ref(false);

const accountLabel = computed(
    () =>
        supabaseUser.value?.user_metadata?.name ??
        supabaseUser.value?.email ??
        "Account",
);

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    if (route.path.startsWith("/projects")) {
        return [{ label: "Projects", to: "/projects" }];
    }
    return [{ label: "Projects", to: "/projects" }];
});

const showNewProject = computed(() => route.path === "/projects");

const accountItems = computed<DropdownMenuItem[][]>(() => [
    [
        {
            label: accountLabel.value,
            avatar: { icon: "i-lucide-user" },
            type: "label",
        },
    ],
    [
        {
            label: "Theme",
            icon: "i-lucide-sun-moon",
            children: [
                {
                    label: "Light",
                    icon: "i-lucide-sun",
                    type: "checkbox",
                    checked: colorMode.preference === "light",
                    onSelect(event) {
                        event.preventDefault();
                        colorMode.preference = "light";
                    },
                },
                {
                    label: "Dark",
                    icon: "i-lucide-moon",
                    type: "checkbox",
                    checked: colorMode.preference === "dark",
                    onSelect(event) {
                        event.preventDefault();
                        colorMode.preference = "dark";
                    },
                },
                {
                    label: "System",
                    icon: "i-lucide-monitor",
                    type: "checkbox",
                    checked: colorMode.preference === "system",
                    onSelect(event) {
                        event.preventDefault();
                        colorMode.preference = "system";
                    },
                },
            ],
        },
        {
            label: "Profile settings",
            icon: "i-lucide-settings",
            disabled: true,
        },
    ],
    [
        {
            label: "Log out",
            icon: "i-lucide-log-out",
            color: "error",
            onSelect: signOut,
        },
    ],
]);

async function signOut() {
    try {
        loading.value = true;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        await navigateTo("/login");
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <UHeader title="Plane Light">
        <template #left>
            <UButton
                to="/projects"
                color="neutral"
                variant="ghost"
                icon="i-lucide-kanban"
                label="Plane Light"
            />
            <UBreadcrumb :items="breadcrumbs" color="neutral" />
        </template>

        <template #right>
            <UButton
                v-if="showNewProject"
                icon="i-lucide-plus"
                label="New project"
                disabled
            />

            <UDropdownMenu
                :items="accountItems"
                :content="{ align: 'end' }"
                :ui="{ content: 'w-56' }"
            >
                <UButton
                    color="neutral"
                    variant="ghost"
                    size="xl"
                    :avatar="{ icon: 'i-lucide-user' }"
                    :loading="loading"
                    square
                    aria-label="Account menu"
                />
            </UDropdownMenu>
        </template>
    </UHeader>

    <UMain>
        <slot />
    </UMain>
</template>

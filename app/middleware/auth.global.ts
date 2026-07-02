export default defineNuxtRouteMiddleware((to) => {
    const session = useSupabaseSession();

    // Protected app pages — redirect to login if no session
    if (to.meta.groups?.includes("app") && !session.value) {
        return navigateTo("/login");
    }

    // Auth pages — redirect to home if already logged in
    // Skip /confirm — it needs the incoming session to finish
    if (
        to.meta.groups?.includes("auth") &&
        to.path !== "/confirm" &&
        session.value
    ) {
        return navigateTo("/");
    }
});

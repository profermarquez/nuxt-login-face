// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = ['/login', '/enroll'];
  if (publicRoutes.includes(to.path)) return;

  try {
    const me = await $fetch('/api/auth/me', { credentials: 'include' });
    if (!me || !(me as any).username) {
      return navigateTo('/login');
    }
  } catch {
    return navigateTo('/login');
  }
});

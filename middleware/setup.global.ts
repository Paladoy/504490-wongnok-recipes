export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();
  // console.log("setup global middleware", user.value);
  setPageLayout("authenticated");
  // if (!user.value) {
  //   // Set default app layout for unauthenticated users
  //   console.log("default layout");
  //   setPageLayout('default')
  // } else {
  //   // Set authenticated app layout for authenticated users
  //   console.log("authenticated layout");
  //   setPageLayout('authenticated')
  // }
});

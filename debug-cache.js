// Verificación de estado del perfil
// Pegar en la consola del navegador para ver qué datos tiene React Query en caché

console.log("🔍 Verificando caché de React Query...");
console.log("Query cache:", window.__REACT_QUERY_STATE__);

// Alternativamente, forzar revalidación desde la consola:
// queryClient.invalidateQueries({ queryKey: ['my-profile'] });

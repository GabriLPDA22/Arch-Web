<template>
  <div class="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100">
    <h1 class="text-6xl font-bold text-gray-800">404</h1>
    <h2 class="mt-4 text-3xl font-semibold text-gray-800">Página No Encontrada</h2>
    <p class="mt-2 text-gray-600">
      La ruta que buscas no existe.
    </p>
    <router-link
      to="/admin"
      class="mt-6 px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
    >
      Ir al Dashboard
    </router-link>
  </div>
</template>

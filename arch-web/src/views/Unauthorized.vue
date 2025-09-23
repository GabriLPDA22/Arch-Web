<template>
  <div class="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100">
    <h1 class="text-6xl font-bold text-red-600">401</h1>
    <h2 class="mt-4 text-3xl font-semibold text-gray-800">Acceso Denegado</h2>
    <p class="mt-2 text-gray-600">
      No tienes permisos de "admin" para ver esta página.
    </p>
    <router-link
      to="/login"
      class="mt-6 px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
    >
      Volver al Login
    </router-link>
  </div>
</template>

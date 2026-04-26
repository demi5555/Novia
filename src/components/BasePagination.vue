<template>
  <nav
    aria-label="Page navigation"
    class="d-flex align-items-center justify-content-between mt-4 px-2"
  >
    <div class="text-secondary small fw-medium">
      Showing <span class="text-dark">{{ first_item }}</span> to
      <span class="text-dark">{{ last_item }}</span> of
      <span class="text-dark">{{ total }}</span> entries
    </div>

    <ul class="pagination pagination-modern mb-0">
      <li class="page-item me-1" :class="{ disabled: on_first_page }">
        <a
          href="#"
          @click.prevent="
            !on_first_page && emit('changePage', current_page - 1)
          "
          class="page-link shadow-sm"
        >
          <i class="bi bi-chevron-left small"></i>
          <span class="ms-1 d-none d-sm-inline">Previous</span>
        </a>
      </li>

      <li
        class="page-item mx-1"
        v-for="page in last_page"
        :key="page"
        :class="{ active: page === current_page }"
      >
        <a
          class="page-link rounded-circle shadow-sm"
          @click.prevent="emit('changePage', page)"
          href="#"
        >
          {{ page }}
        </a>
      </li>

      <li class="page-item ms-1" :class="{ disabled: !has_more_pages }">
        <a
          class="page-link shadow-sm"
          href="#"
          @click.prevent="
            has_more_pages && emit('changePage', current_page + 1)
          "
        >
          <span class="me-1 d-none d-sm-inline">Next</span>
          <i class="bi bi-chevron-right small"></i>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const props = defineProps({
  last_page: Number,
  current_page: Number,
  has_more_pages: Boolean,
  on_first_page: Boolean,
  total: Number,
  first_item: Number,
  last_item: Number,
});

const emit = defineEmits(["changePage"]);
</script>
<style scoped>
.pagination-modern .page-link {
  color: #555;
  background-color: #fff;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 0.9rem;
}

.pagination-modern .rounded-circle {
  width: 38px;
  height: 38px;
  padding: 0;
}

.pagination-modern .page-item.active .page-link {
  background-color: #42b883;
  color: #fff;
  border-color: #42b883;
}

.pagination-modern .page-item.disabled .page-link {
  color: #ced4da;
  pointer-events: none;
  background-color: #fff;
  border-color: #f1f3f5;
  box-shadow: none !important;
}

.pagination-modern .page-item:first-child .page-link,
.pagination-modern .page-item:last-child .page-link {
  border-radius: 20px;
}
</style>

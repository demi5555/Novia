<script setup lang="ts">
import { TrendingUp, Users, Calendar, Briefcase, GraduationCap, Megaphone } from 'lucide-vue-next';

const categories = [
  { icon: Calendar, name: 'Event', count: 10, color: 'text-primary' },
  { icon: GraduationCap, name: 'Study', count: 3, color: 'text-success' },
  { icon: Megaphone, name: 'Presentation', count: 5, color: 'text-purple' },
  { icon: Briefcase, name: 'Internship', count: 2, color: 'text-warning' },
  { icon: Users, name: 'Jobs', count: 4, color: 'text-danger' },
];
</script>

<template>
  <div class="col-10  position-sticky top-0 " style="height: 100vh">

    <!-- Categories -->
    <div class="card  mb-4">
      <div class="card-body">
        <div class="d-flex align-items-center gap-2 mb-3">
          <TrendingUp class="text-primary" />
          <h5 class="m-0 fw-semibold text-dark">Categories</h5>
        </div>

        <div class="list-group border-0">
          <button
            v-for="category in categories"
            :key="category.name"
            class="d-flex justify-content-between align-items-center border-0 list-group-item-action mb-2 rounded"
          >
            <div class="d-flex align-items-center gap-3">
              <component :is="category.icon" :class="category.color" />
              <span class="fw-medium text-dark">{{ category.name }}</span>
            </div>
            <span class="text-muted fw-semibold">{{ category.count }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="card">
      <div class="card-body">
        <h5 class="fw-semibold text-dark mb-3">Community Stats</h5>

        <div class="d-flex justify-content-between mb-2">
          <span class="text-muted">Total Posts</span>
          <span class="fw-bold text-dark">40</span>
        </div>

        <div class="d-flex justify-content-between mb-2">
          <span class="text-muted">Active Users</span>
          <span class="fw-bold text-dark">24</span>
        </div>

        <div class="d-flex justify-content-between">
          <span class="text-muted">Today's Posts</span>
          <span class="fw-bold text-primary">3</span>
        </div>
      </div>
    </div>

  </div>
</template>
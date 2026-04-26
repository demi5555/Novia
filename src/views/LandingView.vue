<template>
  <div>
    <nav class="navbar border-bottom">
      <div class="container d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <i class="bi bi-briefcase-fill text-primary me-2"></i>
          <span class="fw-bold fs-4">Novia</span>
        </div>
        <div class="navbar-nav d-flex flex-row gap-3">
          <router-link to="/login" class="nav-link text-dark">
            Sign In
          </router-link>
          <router-link to="/register" class="btn text-light" style="background-color: #c77dff;">
            Join Now
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-banner py-5 bg-light">
      <div class="container">
        <div class="row align-items-center">
          <!-- Left -->
          <div class="col-md-6 hero-content">
            <h1 class="fw-bold mb-4">
              Welcome to your professional community
            </h1>
            <p class="mb-4 text-muted">
              Connect with professionals, share your expertise, and grow your
              career with Novia - the platform built for modern professionals.
            </p>
            <router-link to="/register" class="btn bg-btn btn-lg text-light">
              Get Started
            </router-link>
          </div>

          <!-- Right -->
          <div class="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1758518731457-5ef826b75b3b"
              alt="Professional collaboration"
              class="img-fluid rounded shadow"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-5">
      <div class="container">
        <h2 class="text-center fw-bold mb-5">
          Everything you need to succeed
        </h2>

        <div class="row text-center">
          <!-- Card 1 -->
          <div class="col-md-6 col-lg-3">
            <div class="card border-0">
              <div class="card-body">
                <user-round class="bi bi-briefcase-fill text-purple fs-1 mb-3"></user-round>

                <h5 class="card-title">Build Your Network</h5>
                <p class="card-text text-muted">
                  Connect with professionals in your industry and expand your opportunities
                </p>
              </div>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="col-md-6 col-lg-3">
            <div class="card border-0">
              <div class="card-body">
                <gift class="bi bi-chat-dots-fill text-success fs-1 mb-3"></gift>
                <h5 class="card-title">Share & Engage</h5>
                <p class="card-text text-muted">
                  Post updates, share insights, and engage with your community
                </p>
              </div>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="col-md-6 col-lg-3">
            <div class="card border-0">
              <div class="card-body">
                <briefcase class="bi bi-briefcase-fill text-purple fs-1 mb-3"></briefcase>
                <h5 class="card-title">Showcase Work</h5>
                <p class="card-text text-muted">
                  Display your projects, skills, and achievements on your profile
                </p>
              </div>
            </div>
          </div>

          <!-- Card 4 -->
          <div class="col-md-6 col-lg-3">
            <div class="card border-0">
              <div class="card-body">
                <airplay class="bi bi-graph-up-arrow text-warning fs-1 mb-3"></airplay>
                <h5 class="card-title">Grow Your Career</h5>
                <p class="card-text text-muted">
                  Discover opportunities and take your career to the next level
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-5  text-white text-center" style="background-color:#c77dff;">
      <div class="container">
        <h2 class="fw-bold mb-3">
          Ready to start your professional journey?
        </h2>
        <p class="mb-4">
          Join thousands of professionals already using Novia
        </p>
        <router-link to="/register" class="btn btn-light btn-lg">
          Create Your Free Account
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-4 bg-light border-top">
      <div class="container d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center row">
          <i class="bi bi-briefcase-fill text-primary me-2"></i>
          <span class="fw-bold">Novia</span>
          <p>Building the future of community 
            <br>collaboration. Connect, share, <br>
            and grow with the next generation of social platforms.</p>
        </div>

        <p class="text-muted small mb-0">
          © 2026 Novia. All rights reserved.
          <p>Building the future of community <br>
            collaboration. Connect, share, and <br>
            grow with the next generationbr
            <br>
             of social platforms.</p>

        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// No extra logic needed
</script>

<style scoped>
.hero-banner {
  background: linear-gradient(to right, #eef2ff, #f4e0ff);
}

  </style>
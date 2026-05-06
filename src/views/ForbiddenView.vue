
<template>
<div class="error-wrapper">
<div class="container">
<div class="error-content text-center">
<!-- Visual Element -->
<div class="error-visual">
<h1 class="display-1 fw-extra-bold text-gradient">404</h1>
<div class="error-icon">
<i class="bi bi-search"></i>
</div>
</div>
<!-- Text Content -->
    <h2 class="fw-bold mb-3">រកមិនឃើញទំព័រ</h2>
    <p class="text-muted mb-5 mx-auto max-w-500">
      សុំទោស! ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមានឡើយ ឬត្រូវបានផ្លាស់ប្តូរទៅកាន់ទីតាំងផ្សេង។
    </p>

    <!-- Action Button -->
    <div class="d-flex justify-content-center gap-3">
      <router-link to="/" class="btn btn-primary-custom px-5 py-3 shadow-sm rounded-pill">
        <i class="bi bi-house-door-fill me-2"></i> ត្រឡប់ទៅទំព័រដើម
      </router-link>
    </div>
  </div>
</div>

<!-- Background Decoration -->
<div class="bg-shapes">
  <div class="shape shape-1"></div>
  <div class="shape shape-2"></div>
</div>
</div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

.error-wrapper {
min-height: 100vh;
display: flex;
align-items: center;
justify-content: center;
font-family: 'Inter', sans-serif;
background-color: #fbf8ff;
position: relative;
overflow: hidden;
padding: 20px;
}

.error-content {
position: relative;
z-index: 2;
}

.error-visual {
position: relative;
margin-bottom: 2rem;
}

.fw-extra-bold { font-weight: 800; }

.display-1 {
font-size: clamp(8rem, 20vw, 12rem);
line-height: 1;
margin-bottom: 0;
letter-spacing: -5px;
opacity: 0.9;
}

.text-gradient {
background: linear-gradient(135deg, #7b2cbf, #c77dff);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
}

.error-icon {
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
background: white;
width: 80px;
height: 80px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
font-size: 2rem;
color: #7b2cbf;
box-shadow: 0 15px 35px rgba(0,0,0,0.1);
animation: float 3s ease-in-out infinite;
}

.max-w-500 {
max-width: 500px;
}

.btn-primary-custom {
background-color: #7b2cbf;
border: none;
color: white;
font-weight: 600;
transition: all 0.3s ease;
display: inline-flex;
align-items: center;
}

.btn-primary-custom:hover {
background-color: #6a1b9a;
transform: translateY(-3px);
box-shadow: 0 10px 20px rgba(123, 44, 191, 0.2) !important;
}

/* Background Shapes */
.bg-shapes .shape {
position: absolute;
filter: blur(80px);
z-index: 1;
border-radius: 50%;
}

.shape-1 {
width: 400px;
height: 400px;
background: #e0aaff;
top: -100px;
right: -100px;
opacity: 0.4;
}

.shape-2 {
width: 350px;
height: 350px;
background: #bde0fe;
bottom: -50px;
left: -100px;
opacity: 0.4;
}

@keyframes float {
0%, 100% { transform: translate(-50%, -50%) translateY(0); }
50% { transform: translate(-50%, -50%) translateY(-15px); }
}

@media (max-width: 576px) {
.display-1 {
font-size: 6rem;
}
.error-icon {
width: 60px;
height: 60px;
font-size: 1.5rem;
}
}
</style>
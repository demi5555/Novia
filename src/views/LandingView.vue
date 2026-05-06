<template>
<div class="landing-wrapper">
<!-- Navbar -->
<nav class="navbar navbar-expand-lg sticky-top navbar-glass">
<div class="container">
<div class="navbar-brand d-flex align-items-center">
<div class="logo-icon me-2">
<i class="bi bi-briefcase-fill"></i>
</div>
<span class="brand-text">Connexion</span>
</div>
<div class="d-flex align-items-center gap-2 gap-md-3">
      <router-link to="/login" class="nav-link fw-semibold px-3">
        ចូលគណនី
      </router-link>
      <router-link to="/register" class="btn btn-primary-custom px-4 shadow-sm">
        ចុះឈ្មោះឥឡូវនេះ
      </router-link>
    </div>
  </div>
</nav>

<!-- Hero Section -->
<section class="hero-section position-relative overflow-hidden">
  <div class="hero-bg-shapes">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
  </div>
  
  <div class="container position-relative">
    <div class="row align-items-center min-vh-75 py-5">
      <div class="col-lg-6 hero-content text-center text-lg-start">
        <span class="badge-premium mb-3">🚀 អនាគតនៃការរីកចម្រើនវិជ្ជាជីវៈ</span>
        <h1 class="display-4 fw-extra-bold mb-4">
          សូមស្វាគមន៍មកកាន់ <span class="text-gradient">សហគមន៍វិជ្ជាជីវៈ</span>  របស់អ្នក
        </h1>
        <p class="lead text-muted mb-5 pe-lg-5">
          ភ្ជាប់ទំនាក់ទំនងជាមួយអ្នកជំនាញ ចែករំលែកបទពិសោធន៍ និងពង្រីកអាជីពរបស់អ្នកជាមួយ Connexion - វេទិកាដែលបង្កើតឡើងសម្រាប់អ្នកជំនាញសម័យថ្មី។
        </p>
        <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
          <router-link to="/register" class="btn btn-primary-lg px-5 py-3 shadow-lg">
            ចាប់ផ្តើមដោយឥតគិតថ្លៃ
          </router-link>
        </div>
      </div>

      <div class="col-lg-6 mt-5 mt-lg-0">
        <div class="hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1758518731457-5ef826b75b3b"
            alt="Professional collaboration"
            class="img-fluid hero-img"
          />
          <div class="floating-card card-1 shadow">
            <i class="bi bi-check-circle-fill text-success me-2"></i> ភ្ជាប់ទំនាក់ទំនង
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Features -->
<section class="features-section py-100">
  <div class="container">
    <div class="text-center max-w-700 mx-auto mb-5">
      <h2 class="section-title">រាល់អ្វីដែលអ្នកត្រូវការដើម្បីជោគជ័យ</h2>
      <p class="text-muted">ឧបករណ៍ដ៏មានប្រសិទ្ធភាពដែលត្រូវបានរចនាឡើងដើម្បីជួយអ្នកបង្កើតឥទ្ធិពល និងពង្រីកបណ្តាញទំនាក់ទំនង។</p>
    </div>

    <div class="row g-4">
      <!-- Card 1 -->
      <div class="col-md-6 col-lg-3">
        <div class="feature-card h-100 shadow-hover">
          <div class="icon-box bg-purple-soft">
            <user-round class="bi bi-briefcase-fill"></user-round>
          </div>
          <h5 class="fw-bold my-3">កសាងបណ្តាញទំនាក់ទំនង</h5>
          <p class="text-muted small mb-0">
            ភ្ជាប់ទំនាក់ទំនងជាមួយអ្នកជំនាញក្នុងវិស័យ​របស់អ្នក និងពង្រីកឱកាសថ្មីៗ។
          </p>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="col-md-6 col-lg-3">
        <div class="feature-card h-100 shadow-hover">
          <div class="icon-box bg-success-soft">
            <gift class="bi bi-chat-dots-fill"></gift>
          </div>
          <h5 class="fw-bold my-3">ចែករំលែក និងប្រាស្រ័យទាក់ទង</h5>
          <p class="text-muted small mb-0">
            បង្ហោះព័ត៌មានថ្មីៗ ចែករំលែកចំណេះដឹង និងប្រាស្រ័យទាក់ទងជាមួយសហគមន៍របស់អ្នក។
          </p>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="col-md-6 col-lg-3">
        <div class="feature-card h-100 shadow-hover">
          <div class="icon-box bg-purple-soft">
            <briefcase class="bi bi-briefcase-fill"></briefcase>
          </div>
          <h5 class="fw-bold my-3">បង្ហាញស្នាដៃ</h5>
          <p class="text-muted small mb-0">
            បង្ហាញគម្រោង ជំនាញ និងសមិទ្ធផលផ្សេងៗនៅលើប្រវត្តិរូបរបស់អ្នក។
          </p>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="col-md-6 col-lg-3">
        <div class="feature-card h-100 shadow-hover">
          <div class="icon-box bg-warning-soft">
            <airplay class="bi bi-graph-up-arrow"></airplay>
          </div>
          <h5 class="fw-bold my-3">អភិវឌ្ឍអាជីព</h5>
          <p class="text-muted small mb-0">
            ស្វែងរកឱកាសថ្មីៗ និងនាំអាជីពរបស់អ្នកទៅកាន់កម្រិតបន្ទាប់។
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="cta-wrapper py-5">
  <div class="container">
    <div class="cta-card shadow-lg p-5 text-center text-white position-relative overflow-hidden">
      <div class="cta-content position-relative">
        <h2 class="fw-bold mb-3 display-6">
          ត្រៀមខ្លួនដើម្បីចាប់ផ្តើមដំណើរកម្សាន្តវិជ្ជាជីវៈរបស់អ្នកហើយឬនៅ?
        </h2>
        <p class="mb-4 opacity-75 lead">
          ចូលរួមជាមួយអ្នកជំនាញរាប់ពាន់នាក់ដែលកំពុងប្រើប្រាស់ Connexion
        </p>
        <router-link to="/register" class="btn btn-light btn-lg px-5 py-3 fw-bold rounded-pill text-purple">
          បង្កើតគណនីឥតគិតថ្លៃ
        </router-link>
      </div>
    </div>
  </div>
</section>

<!-- Footer -->
<footer class="footer-section py-5 bg-white">
  <div class="container">
    <div class="row gy-4 align-items-start">
      <div class="col-lg-5">
        <div class="d-flex align-items-center mb-3">
          <div class="logo-icon-sm me-2">
            <i class="bi bi-briefcase-fill"></i>
          </div>
          <span class="fw-bold fs-4">Connexion</span>
        </div>
        <p class="text-muted pe-lg-5">
          ការកសាងអនាគតនៃកិច្ចសហការក្នុងសហគមន៍។ ភ្ជាប់ទំនាក់ទំនង ចែករំលែក និងរីកចម្រើនជាមួយវេទិកាសង្គមជំនាន់ថ្មី។
        </p>
      </div>
      
      <div class="col-lg-7 text-lg-end">
        <div class="footer-meta">
          <p class="text-muted small mb-1">© ២០២៦ Connexion រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
          <p class="text-muted small footer-desc-slim">
            ការកសាងអនាគតនៃកិច្ចសហការក្នុងសហគមន៍។ ភ្ជាប់ទំនាក់ទំនង ចែករំលែក និងរីកចម្រើនជាមួយវេទិកាសង្គមជំនាន់ថ្មី។
          </p>
        </div>
      </div>
    </div>
  </div>
</footer>
</div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

.landing-wrapper {
font-family: 'Inter', sans-serif;
color: #1a1a1a;
background-color: #ffffff;
}

/* --- Typography --- */
.fw-extra-bold { font-weight: 800; }
.text-gradient {
background: linear-gradient(135deg, #7b2cbf, #c77dff);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
}
.text-purple { color: #7b2cbf; }

/* --- Navbar --- */
.navbar-glass {
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(10px);
padding: 1rem 0;
border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.brand-text {
font-size: 1.5rem;
font-weight: 700;
letter-spacing: -0.5px;
}
.logo-icon {
background: #c77dff;
color: white;
width: 40px;
height: 40px;
display: flex;
align-items: center;
justify-content: center;
border-radius: 12px;
}
.btn-primary-custom {
background-color: #c77dff;
border: none;
border-radius: 10px;
color: white;
transition: transform 0.2s, background-color 0.2s;
}
.btn-primary-custom:hover {
background-color: #9d4edd;
transform: translateY(-1px);
}

/* --- Hero Section --- */
.hero-section {
padding: 100px 0;
background-color: #fbf8ff;
}
.hero-bg-shapes .shape {
position: absolute;
filter: blur(80px);
z-index: 0;
border-radius: 50%;
}
.shape-1 { width: 300px; height: 300px; background: #e0aaff; top: -100px; right: -50px; opacity: 0.3; }
.shape-2 { width: 400px; height: 400px; background: #bde0fe; bottom: -100px; left: -50px; opacity: 0.2; }

.badge-premium {
display: inline-block;
padding: 8px 16px;
background: white;
border: 1px solid #eee;
border-radius: 100px;
font-weight: 600;
font-size: 0.85rem;
box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.btn-primary-lg {
background: #c77dff;
color: white;
border: none;
border-radius: 12px;
font-weight: 600;
transition: all 0.3s ease;
}
.btn-primary-lg:hover {
background: #9d4edd;
transform: translateY(-3px);
box-shadow: 0 10px 20px rgba(199, 125, 255, 0.3);
}

.hero-image-wrapper {
position: relative;
z-index: 2;
}
.hero-img {
border-radius: 24px;
box-shadow: 0 20px 40px rgba(0,0,0,0.1);
transform: perspective(1000px) rotateY(-5deg);
}
.floating-card {
position: absolute;
bottom: 30px;
left: -20px;
background: white;
padding: 15px 25px;
border-radius: 16px;
font-weight: 600;
animation: float 3s ease-in-out infinite;
}

/* --- Features Section --- */
.py-100 { padding: 100px 0; }
.max-w-700 { max-width: 700px; }
.section-title { font-weight: 700; font-size: 2.25rem; margin-bottom: 1rem; }

.feature-card {
background: white;
padding: 40px 30px;
border-radius: 20px;
border: 1px solid #f0f0f0;
transition: all 0.3s ease;
}
.feature-card:hover {
transform: translateY(-10px);
border-color: #c77dff;
box-shadow: 0 15px 30px rgba(0,0,0,0.05);
}

.icon-box {
width: 60px;
height: 60px;
border-radius: 15px;
display: flex;
align-items: center;
justify-content: center;
font-size: 1.75rem;
}
.bg-purple-soft { background-color: #f3e8ff; color: #7b2cbf; }
.bg-success-soft { background-color: #e6fffa; color: #059669; }
.bg-warning-soft { background-color: #fffbeb; color: #d97706; }

/* --- CTA Section --- */
.cta-card {
background: linear-gradient(135deg, #7b2cbf 0%, #c77dff 100%);
border-radius: 30px;
border: none;
}
.cta-card::before {
content: '';
position: absolute;
width: 100%;
height: 100%;
top: 0; left: 0;
background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}

/* --- Footer --- */
.logo-icon-sm {
background: #c77dff;
color: white;
width: 32px;
height: 32px;
display: flex;
align-items: center;
justify-content: center;
border-radius: 8px;
}
.footer-desc-slim {
max-width: 400px;
margin-left: auto;
}

/* --- Animations --- */
@keyframes float {
0% { transform: translateY(0px); }
50% { transform: translateY(-10px); }
100% { transform: translateY(0px); }
}

@media (max-width: 991px) {
.hero-img { transform: none; }
.footer-desc-slim { margin-left: 0; }
.text-lg-end { text-align: left !important; }
}
</style>
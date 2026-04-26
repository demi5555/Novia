<script setup>
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <DashboardLayout>
    <div class="about-page">
      <div class="container">

        <!-- Hero -->
        <div class="about-hero">
          <div class="hero-icon">
            <i class="bi bi-hexagon-fill"></i>
          </div>
          <div class="hero-text">
            <h1>About <span class="brand">Novia</span></h1>
            <p>A Tech Community built for developers, designers, and creators — where talent meets opportunity.</p>
          </div>
        </div>

        <!-- Mission banner -->
        <div class="mission-banner">
          <i class="bi bi-rocket-takeoff-fill mission-icon"></i>
          <div>
            <strong>Our Mission</strong>
            <p>To connect tech professionals across Cambodia and Southeast Asia through shared knowledge, job opportunities, and meaningful events.</p>
          </div>
        </div>

        <!-- Three pillars -->
        <div class="pillars">

          <div class="pillar">
            <div class="pillar-icon community">
              <i class="bi bi-people-fill"></i>
            </div>
            <h3>Tech Community</h3>
            <p>
              Novia is a space where developers, designers, students, and tech professionals connect.
              Share posts, showcase your projects, discover what others are building, and grow your
              professional network — all in one place.
            </p>
            <ul class="pillar-list">
              <li><i class="bi bi-check2-circle"></i> Create a professional profile with CV & skills</li>
              <li><i class="bi bi-check2-circle"></i> Share tech ideas, news, and projects</li>
              <li><i class="bi bi-check2-circle"></i> Direct message anyone in the network</li>
              <li><i class="bi bi-check2-circle"></i> Collaborate with companies and teams</li>
            </ul>
          </div>

          <div class="pillar">
            <div class="pillar-icon jobs">
              <i class="bi bi-briefcase-fill"></i>
            </div>
            <h3>Jobs & Opportunities</h3>
            <p>
              Looking for your next role, freelance gig, or internship? Novia lets companies and
              recruiters post opportunities directly to the tech community. Upload your CV and let
              the right people find you.
            </p>
            <ul class="pillar-list">
              <li><i class="bi bi-check2-circle"></i> Browse tech job postings</li>
              <li><i class="bi bi-check2-circle"></i> Upload your resume / CV</li>
              <li><i class="bi bi-check2-circle"></i> Showcase your portfolio and experience</li>
              <li><i class="bi bi-check2-circle"></i> Get discovered by companies</li>
            </ul>
          </div>

          <div class="pillar">
            <div class="pillar-icon events">
              <i class="bi bi-calendar-event-fill"></i>
            </div>
            <h3>Events & Meetups</h3>
            <p>
              Stay connected with the local tech scene. Novia surfaces hackathons, workshops,
              webinars, and networking events so you never miss a chance to learn, compete, or
              meet like-minded people.
            </p>
            <ul class="pillar-list">
              <li><i class="bi bi-check2-circle"></i> Discover upcoming tech events</li>
              <li><i class="bi bi-check2-circle"></i> Post and promote your own events</li>
              <li><i class="bi bi-check2-circle"></i> Join hackathons and coding competitions</li>
              <li><i class="bi bi-check2-circle"></i> Connect with speakers and organizers</li>
            </ul>
          </div>

        </div>

        <!-- How it works -->
        <div class="section-card">
          <h2><i class="bi bi-diagram-3-fill"></i> How It Works</h2>
          <div class="steps">
            <div class="step">
              <div class="step-num">1</div>
              <div>
                <strong>Create Your Profile</strong>
                <p>Sign up and build your professional profile. Add your skills, education, work experience, CV, and collaboration details.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-num">2</div>
              <div>
                <strong>Explore the Community</strong>
                <p>Browse posts from other tech professionals. Discover jobs, events, and projects being shared across the platform.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-num">3</div>
              <div>
                <strong>Share & Engage</strong>
                <p>Publish your own posts — share what you're working on, a job you're hiring for, or an upcoming event you're organizing.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-num">4</div>
              <div>
                <strong>Connect & Collaborate</strong>
                <p>Message professionals directly, visit their profiles, and build real working relationships in the tech space.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick links -->
        <div class="quick-links">
          <button class="ql-btn" @click="router.push('/faq')">
            <i class="bi bi-question-circle-fill"></i>
            <span>Read the FAQ</span>
          </button>
          <button class="ql-btn" @click="router.push('/help')">
            <i class="bi bi-life-preserver"></i>
            <span>Visit Help Center</span>
          </button>
          <button class="ql-btn" @click="router.push('/')">
            <i class="bi bi-house-door-fill"></i>
            <span>Back to Home</span>
          </button>
        </div>

      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 28px 16px 48px;
}
.container {
  max-width: 960px;
  margin: 0 auto;
}

/* Hero */
.about-hero {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
}
.hero-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(99,102,241,0.35);
}
.hero-text h1 {
  margin: 0 0 4px;
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
}
.hero-text .brand { color: #6366f1; }
.hero-text p {
  margin: 0;
  color: #64748b;
  font-size: .95rem;
}

/* Mission banner */
.mission-banner {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 14px;
  padding: 18px 22px;
  color: #fff;
  margin-bottom: 28px;
}
.mission-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
  margin-top: 2px;
}
.mission-banner strong {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 4px;
}
.mission-banner p {
  margin: 0;
  font-size: .88rem;
  opacity: .92;
  line-height: 1.6;
}

/* Three pillars */
.pillars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}
@media (max-width: 768px) {
  .pillars { grid-template-columns: 1fr; }
}
.pillar {
  background: #fff;
  border-radius: 14px;
  padding: 22px 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
}
.pillar-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin-bottom: 14px;
}
.pillar-icon.community { background: #ede9fe; color: #6366f1; }
.pillar-icon.jobs      { background: #dcfce7; color: #16a34a; }
.pillar-icon.events    { background: #fef3c7; color: #d97706; }
.pillar h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
}
.pillar p {
  font-size: .84rem;
  color: #64748b;
  line-height: 1.65;
  margin: 0 0 14px;
}
.pillar-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.pillar-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: .82rem;
  color: #374151;
}
.pillar-list i { color: #6366f1; flex-shrink: 0; }

/* How it works */
.section-card {
  background: #fff;
  border-radius: 14px;
  padding: 22px 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
  margin-bottom: 24px;
}
.section-card h2 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  gap: 9px;
}
.section-card h2 i { color: #6366f1; }
.steps { display: flex; flex-direction: column; gap: 18px; }
.step {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.step-num {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-size: .88rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.step strong { display: block; font-size: .9rem; color: #1e293b; margin-bottom: 3px; }
.step p { margin: 0; font-size: .82rem; color: #64748b; line-height: 1.6; }

/* Quick links */
.quick-links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.ql-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 18px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #374151;
  font-size: .88rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all .15s;
}
.ql-btn:hover { border-color: #6366f1; color: #6366f1; background: #f8f5ff; }
.ql-btn i { font-size: 1rem; }
</style>

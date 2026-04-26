<script setup>
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const openIndex = ref(null)

const toggle = (i) => {
  openIndex.value = openIndex.value === i ? null : i
}

const faqs = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'What is Novia?',
        a: 'Novia is a tech community platform where developers, designers, students, and tech professionals connect. You can share posts, find jobs, discover events, message others, and build a professional profile — all in one place.'
      },
      {
        q: 'Who can join Novia?',
        a: 'Anyone with a passion for technology. Whether you\'re a student, a freelancer, a professional, or a company looking to hire — Novia is open to everyone in the tech space.'
      },
      {
        q: 'Is Novia free to use?',
        a: 'Yes. Creating an account and using all core features — posts, messaging, profiles, and the community feed — is completely free.'
      },
    ]
  },
  {
    category: 'Profile & CV',
    items: [
      {
        q: 'How do I upload my CV?',
        a: 'Go to your Profile page and click the CV tab. You can upload a PDF, DOC, or DOCX file. Anyone viewing your public profile can then view or download your resume.'
      },
      {
        q: 'Can other users see my personal information?',
        a: 'Your public profile shows your name, job title, skills, education, projects, and collaboration details. Sensitive data like your password is never shared.'
      },
      {
        q: 'How do I add or remove skills?',
        a: 'On your profile page, click the Skills button. A modal will appear where you can search existing skills, select them, or create a new one if it doesn\'t exist yet.'
      },
      {
        q: 'What is the Collaboration section?',
        a: 'The Collaboration section lets you add your company logo and a link to your organization or portfolio. It signals to the community that you\'re open to partnerships or hiring.'
      },
    ]
  },
  {
    category: 'Posts & Community',
    items: [
      {
        q: 'What can I post on Novia?',
        a: 'You can post anything tech-related: project updates, job openings, upcoming events, tutorials, news, or community discussions. Choose a category when creating a post to help others find it.'
      },
      {
        q: 'What post categories are available?',
        a: 'Posts are organized by category — Community, Job, Event, and Project. Use the appropriate category so users looking for jobs or events can filter them easily.'
      },
      {
        q: 'Can I attach files or images to a post?',
        a: 'Yes. When creating a post you can attach images and files to provide more context or showcase your work.'
      },
    ]
  },
  {
    category: 'Jobs & Events',
    items: [
      {
        q: 'How do I find job opportunities?',
        a: 'Browse the Home feed and filter by the "Job" category. Companies and recruiters post openings directly on Novia. You can also make sure your profile and CV are up-to-date so recruiters can find you.'
      },
      {
        q: 'How do I find or promote tech events?',
        a: 'Filter posts by the "Event" category to see upcoming hackathons, workshops, and meetups. To promote your own event, create a new post and select "Event" as the category.'
      },
    ]
  },
  {
    category: 'Messaging & Security',
    items: [
      {
        q: 'How do I send a message to someone?',
        a: 'Go to the Message page from the left sidebar or click the Message button on any user\'s profile. Type your message and press Enter to send. Conversations are real-time.'
      },
      {
        q: 'How do I change my password?',
        a: 'Go to Privacy & Security from the sidebar. Enter your current password, then your new password, and confirm it. Hit Save to update.'
      },
      {
        q: 'What should I do if I can\'t log in?',
        a: 'Use the Forgot Password link on the login page. Enter your email to receive a verification code, then follow the steps to reset your password.'
      },
    ]
  },
]
</script>

<template>
  <DashboardLayout>
    <div class="faq-page">
      <div class="container">

        <!-- Header -->
        <div class="page-header">
          <div class="header-icon">
            <i class="bi bi-question-circle-fill"></i>
          </div>
          <div>
            <h1>Frequently Asked Questions</h1>
            <p>Quick answers to the most common questions about Novia.</p>
          </div>
        </div>

        <!-- FAQ sections -->
        <div v-for="(section, si) in faqs" :key="si" class="faq-section">
          <div class="section-label">{{ section.category }}</div>
          <div class="accordion">
            <div
              v-for="(item, ii) in section.items"
              :key="ii"
              class="acc-item"
              :class="{ open: openIndex === `${si}-${ii}` }"
            >
              <button class="acc-q" @click="toggle(`${si}-${ii}`)">
                <span>{{ item.q }}</span>
                <i class="bi" :class="openIndex === `${si}-${ii}` ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </button>
              <div class="acc-a" v-show="openIndex === `${si}-${ii}`">
                <p>{{ item.a }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer CTA -->
        <div class="faq-footer">
          <i class="bi bi-headset"></i>
          <div>
            <strong>Didn't find your answer?</strong>
            <p>Visit the Help Center for step-by-step guides on every feature.</p>
          </div>
          <button class="btn-help" @click="router.push('/help')">
            <i class="bi bi-life-preserver"></i> Help Center
          </button>
        </div>

      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.faq-page {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 28px 16px 48px;
}
.container {
  max-width: 780px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}
.header-icon {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 4px 18px rgba(99,102,241,.3);
}
.page-header h1 {
  margin: 0 0 4px;
  font-size: 1.55rem;
  font-weight: 800;
  color: #0f172a;
}
.page-header p {
  margin: 0;
  color: #64748b;
  font-size: .9rem;
}

/* Section */
.faq-section { margin-bottom: 28px; }
.section-label {
  font-size: .75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: #6366f1;
  margin-bottom: 10px;
  padding-left: 4px;
}

/* Accordion */
.accordion {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.acc-item {
  background: #fff;
  border-radius: 12px;
  border: 1.5px solid #e5e7eb;
  overflow: hidden;
  transition: border-color .15s;
}
.acc-item.open { border-color: #6366f1; }
.acc-q {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: .9rem;
  font-weight: 600;
  color: #1e293b;
  text-align: left;
}
.acc-q:hover { color: #6366f1; }
.acc-item.open .acc-q { color: #6366f1; }
.acc-q i { flex-shrink: 0; font-size: .85rem; }
.acc-a {
  padding: 0 16px 14px;
  border-top: 1px solid #f1f5f9;
}
.acc-a p {
  margin: 10px 0 0;
  font-size: .86rem;
  color: #475569;
  line-height: 1.65;
}

/* Footer */
.faq-footer {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  padding: 20px 22px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
}
.faq-footer > i {
  font-size: 1.6rem;
  color: #6366f1;
  flex-shrink: 0;
}
.faq-footer strong {
  display: block;
  font-size: .9rem;
  color: #1e293b;
  margin-bottom: 3px;
}
.faq-footer p {
  margin: 0;
  font-size: .82rem;
  color: #64748b;
}
.btn-help {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 9px;
  border: 1.5px solid #6366f1;
  background: #6366f1;
  color: #fff;
  font-size: .84rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all .15s;
  flex-shrink: 0;
}
.btn-help:hover { background: #4f46e5; border-color: #4f46e5; }
</style>

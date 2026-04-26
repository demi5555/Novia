import { defineStore } from "pinia"
import api from "@/api/http"

export const useProfileStore = defineStore("profile", {
  state: () => ({
    profile: null,
    loading: false,
    error: null,
    availableSkills: [],
  }),

  actions: {
    async getProfile() {
      this.loading = true
      this.error = null
      try {
        const res = await api.get("/api/profile")
        if (res.data.result) this.profile = res.data.data
        return res
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    },

    async getProfileByUserId(userId) {
      this.loading = true
      this.error = null
      try {
        const res = await api.get(`/api/profile/users/${userId}`)
        if (res.data.result) this.profile = res.data.data
        return res
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    },

    async updatePersonalInfo(payload) {
      this.loading = true
      this.error = null
      try {
        const params = new URLSearchParams(payload)
        const res = await api.put("/api/profile/info", params)
        if (res.data.result) this.profile = { ...this.profile, ...res.data.data }
        return res
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateProfessional(payload) {
      this.loading = true
      this.error = null
      try {
        const params = new URLSearchParams(payload)
        const res = await api.put("/api/profile/professional", params)
        if (res.data.result) this.profile = { ...this.profile, ...res.data.data }
        return res
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateAvatar(file) {
      this.loading = true
      this.error = null
      try {
        const form = new FormData()
        form.append("avatar", file)
        const res = await api.post("/api/profile/avatar", form)
        if (res.data.result && this.profile) this.profile.avatar = res.data.data.avatar
        return res
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    },

    async deleteAvatar() {
      this.loading = true
      this.error = null
      try {
        const res = await api.delete("/api/profile/avatar")
        if (res.data.result && this.profile) this.profile.avatar = null
        return res
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateCover(file) {
      this.loading = true
      this.error = null
      try {
        const form = new FormData()
        form.append("cover", file)
        const res = await api.post("/api/profile/cover", form)
        if (res.data.result && this.profile) this.profile.cover = res.data.data.cover
        return res
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    },

    async deleteCover() {
      this.loading = true
      this.error = null
      try {
        const res = await api.delete("/api/profile/cover")
        if (res.data.result && this.profile) this.profile.cover = null
        return res
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateSkills(skillIds) {
      this.loading = true
      this.error = null
      try {
        const params = new URLSearchParams()
        params.append("skill_ids", JSON.stringify(skillIds))
        const res = await api.put("/api/profile/skills", params)
        if (res.data.result && this.profile) {
          this.profile.skills = res.data.data.skills ?? res.data.data
        }
        return res
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    },

    async getAllSkills() {
      try {
        const res = await api.get("/api/skills")
        if (res.data.result) this.availableSkills = res.data.data
        return res
      } catch (e) {
        throw e
      }
    },

    async addNewSkill(name) {
      try {
        const form = new FormData()
        form.append("name", name)
        const res = await api.post("/api/skills", form)
        if (res.data.result) {
          const skill = res.data.data
          this.availableSkills = [...this.availableSkills, skill]
        }
        return res
      } catch (e) {
        throw e
      }
    },

    async updateCV(file) {
      this.loading = true
      this.error = null
      try {
        const form = new FormData()
        form.append("cv", file)
        const res = await api.post("/api/profile/cv", form)
        if (res.data.result && this.profile) this.profile.cv = res.data.data.cv
        return res
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateCollaboration(formData) {
      this.loading = true
      this.error = null
      try {
        const res = await api.post("/api/profile/collaboration", formData)
        if (res.data.result && this.profile) {
          this.profile.collaboration = res.data.data.collaboration ?? res.data.data
        }
        return res
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    },

    async changePassword(payload) {
      this.loading = true
      this.error = null
      try {
        const params = new URLSearchParams(payload)
        const res = await api.put("/api/profile/change-pass", params)
        return res
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    },

    async deleteAccount() {
      this.loading = true
      this.error = null
      try {
        const res = await api.delete("/api/profile/delete-acc")
        if (res.data.result) this.profile = null
        return res
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    },

    // Education CRUD
    async addEducation(payload) {
      this.loading = true
      this.error = null
      try {
        const form = new FormData()
        Object.entries(payload).forEach(([k, v]) => {
          if (v !== null && v !== undefined && v !== "") form.append(k, v)
        })
        const res = await api.post("/api/educations", form)
        if (res.data.result && this.profile) {
          this.profile.educations = res.data.data.educations ?? this.profile.educations
        }
        return res
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateEducation(id, payload) {
      this.loading = true
      this.error = null
      try {
        const params = new URLSearchParams()
        Object.entries(payload).forEach(([k, v]) => {
          if (v !== null && v !== undefined) params.append(k, v)
        })
        const res = await api.put(`/api/educations/${id}`, params)
        if (res.data.result && this.profile) {
          this.profile.educations = res.data.data.educations ?? this.profile.educations
        }
        return res
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    },

    async deleteEducation(id) {
      this.loading = true
      this.error = null
      try {
        const res = await api.delete(`/api/educations/${id}`)
        if (res.data.result && this.profile) {
          this.profile.educations = this.profile.educations?.filter(e => e.id !== id)
        }
        return res
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    },

    clearProfile() {
      this.profile = null
      this.error = null
    },
  },
})

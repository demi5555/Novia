import { useToast } from "vue-toast-notification"

export const notify = (router) => {
    const toast = useToast()

    const defaultOptions = {
        position: "bottom-left",
        duration: 2000
    }

    const showToast = (type, text, options = {}, redirect = null) => {
        const config = { ...defaultOptions, ...options }

        toast[type](text, config)

        if (redirect) {
            setTimeout(() => {
                router.push(redirect)
            }, config.duration)
        }
    }

    return {
        success(text, redirect = null, options = {}) {
            showToast("success", text, options, redirect)
        },

        error(text, options = {}) {
            showToast("error", text, options)
        },

        warning(text, options = {}) {
            showToast("warning", text, options)
        },

        info(text, options = {}) {
            showToast("info", text, options)
        },

        loading(text = "Processing...") {
            return toast.open({
                message: text,
                type: "default",
                duration: 0
            })
        },

        clear() {
            toast.clear()
        }
    }
}
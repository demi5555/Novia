export const required = (value, message = 'This field is required') => {
    return value && String(value).trim() ? "" : message; 
}

export const validateContentLength = (value, minLength = 10) => {
    return value && value.trim().length >= minLength ? '' : `Content must be at least ${minLength} characters`
}

export function required(value, message = "This field is required") {
    return value && String(value).trim() ? "" : message;
}

export function isEmail(value, message = "Invalid email format") {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        .test(String(value).trim())
        ? ""
        : message;
}

export function isPassword(
    value,
    message =
        "Password must contain 8 characters, uppercase, lowercase, number and special character"
) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        .test(String(value).trim())
        ? ""
        : message;
}

export function validate(value, rules = []) {
    for (const rule of rules) {
        const err = rule(value);
        if (err) return err;
    }
    return "";
}
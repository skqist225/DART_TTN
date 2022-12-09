export function setUserToLocalStorage(user) {
    if (user) {
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.removeItem("authtoken");
        localStorage.setItem("authtoken", user.token);
    }
}

export function removeUserFromLocalStorage() {
    localStorage.removeItem("user");
    localStorage.removeItem("authtoken");
}

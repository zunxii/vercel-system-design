const MAX_LENGTH = 5;
export function generate() {
    let ans = "";
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < MAX_LENGTH; i++) {
        ans += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return ans;
}
//# sourceMappingURL=utils.js.map
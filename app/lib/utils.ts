function isWeekend() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    return (day === 5 && hour >= 14) || (day === 6) || (day === 0 && hour < 10);
}

function isLunch() {
    const now = new Date();
    const hour = now.getHours();
    return hour < 14;
}

function isDinner() {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 14 && hour < 21;
}

export { isWeekend, isLunch, isDinner };

export default {
    isWeekend,
    isLunch,
    isDinner,
};
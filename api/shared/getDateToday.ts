export function getDateToday(): Date {
        const today = new Date();
        today.setHours(21, 0, 0, 0); 
        return today;
}
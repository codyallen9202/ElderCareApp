// Function to return current date as an array
// [Year, Month, Day, Weekday]
// [Int, Str, Int, Str]

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Sep", "Oct", "Nov", "Dec"]

export default function getDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    const weekday = today.getDay();

    const dateArray = [year, months[month], day, weekdays[weekday]];

    return dateArray;
}
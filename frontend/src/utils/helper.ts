export function formatDate (date: string){
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString("default",{month:"long"});
    const year = d.getFullYear();
    return `${day} ${month} , ${year}`
}

export function formatTime(time:string){
    const [hours , minutes] = time.split(":").map(Number);
    const period =  hours >= 12 ?"PM" : "AM";
    const adjustedHours = hours % 12 || 12;
    const formatedMinutes = minutes < 10 ? `0${minutes}`: minutes;

    return `${adjustedHours}:${formatedMinutes} ${period}`
}
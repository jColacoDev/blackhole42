export const daysBetweenDates = (dateString1, dateString2 = new Date().toISOString().slice(0, 10)) => {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
    
    const timeDifference = Math.abs(date2 - date1);
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
    return daysDifference;
};

export const formatToYYYYMMDD = (dateString, options = {}) => {
    const {
    year = true,
    month = true,
    day = true,
    separator = '-'
    } = options;

    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    const parts = [];
    if (year) parts.push(yyyy);
    if (month) parts.push(mm);
    if (day) parts.push(dd);

    return parts.join(separator);
};




export const messageValidator = (message: string): string | null => {
    if (message.length === 0) return "Message cannot be empty";
    if (message.includes("\n")) return "New line characters are not permitted";
    return null;
};
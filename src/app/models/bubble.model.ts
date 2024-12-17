export interface Bubble {
    id: string;
    message: string;
    colour: string;
    background?: string | null;
    send?: boolean;
}
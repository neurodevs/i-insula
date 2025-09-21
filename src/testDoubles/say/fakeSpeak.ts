export let callsToSpeak: CallToSpeak[] = []

export function resetFakeSpeak() {
    callsToSpeak = []
}

export default function fakeSpeak(
    text: string, 
    voice?: string, 
    speed?: number, 
    callback?: (text: string) => void
) {
    callsToSpeak.push({ text, voice, speed, callback })
}

export interface CallToSpeak {
    text: string
    voice?: string
    speed?: number
    callback?: (text: string) => void
}
import { useEffect, useState } from "react";

const lines = [
    { lead: "IT support that feels", accent: "effortless." },
    { lead: "Every request, made", accent: "clearer." },
    { lead: "Support that keeps work", accent: "moving." },
    { lead: "Stay ahead of every", accent: "deadline." },
];

export function TypingHeadline() {
    const [reducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const [lineIndex, setLineIndex] = useState(0);
    const [visibleCharacters, setVisibleCharacters] = useState(reducedMotion ? `${lines[0].lead} ${lines[0].accent}`.length : 0);
    const [deleting, setDeleting] = useState(false);
    const line = lines[lineIndex];
    const fullText = `${line.lead} ${line.accent}`;

    useEffect(() => {
        if (reducedMotion) return;

        let delay: number;
        let next: () => void;
        if (!deleting && visibleCharacters < fullText.length) {
            delay = 43;
            next = () => setVisibleCharacters(count => count + 1);
        } else if (!deleting) {
            delay = 2500;
            next = () => setDeleting(true);
        } else if (visibleCharacters > 0) {
            delay = 22;
            next = () => setVisibleCharacters(count => count - 1);
        } else {
            delay = 180;
            next = () => { setLineIndex(index => (index + 1) % lines.length); setDeleting(false); };
        }

        const timeout = window.setTimeout(next, delay);
        return () => window.clearTimeout(timeout);
    }, [deleting, fullText.length, reducedMotion, visibleCharacters]);

    const visibleLead = line.lead.slice(0, visibleCharacters);
    const visibleAccent = line.accent.slice(0, Math.max(0, visibleCharacters - line.lead.length - 1));

    return <h1 className="landing-headline" aria-label="IT support that feels effortless.">
        <span className="headline-display" aria-hidden="true">
            {visibleLead}{visibleCharacters > line.lead.length ? " " : ""}<span className="headline-accent">{visibleAccent}</span>
            {!reducedMotion && <span className="headline-caret" />}
        </span>
    </h1>;
}

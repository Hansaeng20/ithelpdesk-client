import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Icon } from "./ui";

type SignOutButtonProps = {
    className: string;
    iconSize?: number;
};

export function SignOutButton({ className, iconSize = 18 }: SignOutButtonProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const stayRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        const trigger = triggerRef.current;
        document.body.style.overflow = "hidden";
        stayRef.current?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                setOpen(false);
                return;
            }

            if (event.key !== "Tab" || !dialogRef.current) return;
            const buttons = Array.from(dialogRef.current.querySelectorAll("button"));
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", onKeyDown);
            if (trigger?.isConnected) trigger.focus();
        };
    }, [open]);

    const confirmSignOut = () => {
        setOpen(false);
        logout();
        navigate("/login", { replace: true });
    };

    return <>
        <button ref={triggerRef} type="button" className={className} onClick={() => setOpen(true)}>
            <Icon name="logout" size={iconSize} />Sign out
        </button>
        {open && createPortal(
            <div className="signout-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false); }}>
                <div ref={dialogRef} className="signout-dialog" role="dialog" aria-modal="true" aria-labelledby="signout-title" aria-describedby="signout-description">
                    <button type="button" className="signout-close" aria-label="Close sign out confirmation" onClick={() => setOpen(false)}><Icon name="close" size={18} /></button>
                    <div className="signout-visual" aria-hidden="true"><span className="signout-ring signout-ring-outer" /><span className="signout-ring signout-ring-inner" /><span className="signout-visual-icon"><Icon name="logout" size={30} /></span><span className="signout-spark signout-spark-one" /><span className="signout-spark signout-spark-two" /></div>
                    <p className="eyebrow">Session control</p>
                    <h2 id="signout-title">Ready to sign out?</h2>
                    <p id="signout-description">Your helpdesk workspace will be here when you sign in again.</p>
                    <div className="signout-actions">
                        <button ref={stayRef} type="button" className="btn btn-outline" onClick={() => setOpen(false)}>Stay in workspace</button>
                        <button type="button" className="btn btn-primary" onClick={confirmSignOut}>Yes, sign out <Icon name="arrowRight" size={16} /></button>
                    </div>
                </div>
            </div>,
            document.body
        )}
    </>;
}

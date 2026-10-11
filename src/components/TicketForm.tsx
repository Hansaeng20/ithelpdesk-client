import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { ticketSchema, type TicketFormData } from "../schemas/ticketSchema";
import { Icon } from "./ui";

const slaHours: Record<TicketFormData["priority"], number> = { Critical: 4, High: 8, Medium: 24, Low: 72 };

export function TicketForm({ initial, isEdit = false, allowPriority = true, cancelTo, onSubmit }: { initial?: TicketFormData; isEdit?: boolean; allowPriority?: boolean; cancelTo: string; onSubmit: (data: TicketFormData) => Promise<void> }) {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<TicketFormData>({ resolver: zodResolver(ticketSchema), defaultValues: initial ?? { title: "", description: "", category: "Software", priority: "Medium" } });
    const priority = useWatch({ control, name: "priority" }) || "Medium";
    const submit: SubmitHandler<TicketFormData> = data => onSubmit(data);

    return <form onSubmit={handleSubmit(submit)} className="panel panel-body form-grid" noValidate>
        <div className="form-span"><label className="field-label" htmlFor="title">What is the issue?</label><input id="title" className="input" placeholder="e.g. Laptop cannot connect to Wi-Fi" aria-invalid={!!errors.title} {...register("title")} /><span className="field-hint">Keep it short and specific so the team can spot your request quickly.</span>{errors.title && <p className="field-error" role="alert">{errors.title.message}</p>}</div>
        <div className="form-span"><label className="field-label" htmlFor="description">Tell us more</label><textarea id="description" className="input" rows={6} placeholder="What happened? When did it start? What have you tried?" aria-invalid={!!errors.description} {...register("description")} /><span className="field-hint">Please avoid sharing passwords or sensitive account details.</span>{errors.description && <p className="field-error" role="alert">{errors.description.message}</p>}</div>
        <div><label className="field-label" htmlFor="category">Category</label><select id="category" className="input" {...register("category")}>{["Hardware", "Software", "Network", "Account Access", "Printer", "Email", "Other"].map(value => <option key={value} value={value}>{value}</option>)}</select>{errors.category && <p className="field-error" role="alert">{errors.category.message}</p>}</div>
        {allowPriority ? <div><label className="field-label" htmlFor="priority">Priority</label><select id="priority" className="input" {...register("priority")}>{["Low", "Medium", "High", "Critical"].map(value => <option key={value} value={value}>{value}</option>)}</select>{errors.priority && <p className="field-error" role="alert">{errors.priority.message}</p>}</div> : <input type="hidden" {...register("priority")} />}
        <div className="form-span notice"><Icon name="clock" size={17} /><div><strong>Service deadline</strong><br />{isEdit && !allowPriority ? "The current priority and SLA are managed by IT Support." : `${priority} priority targets a response within ${slaHours[priority]} hours. The deadline is set automatically when your ticket is saved.`}</div></div>
        <div className="form-span form-actions"><Link to={cancelTo} className="btn btn-outline">Cancel</Link><button type="submit" className="btn btn-primary" disabled={isSubmitting}><Icon name={isEdit ? "check" : "plus"} size={17} />{isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Submit request"}</button></div>
    </form>;
}

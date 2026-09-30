"use client";
import { useState } from "react";
import { useCreateEventMutation, useDeleteEventMutation, useEventsQuery, useUpdateEventStatusMutation } from "../hooks";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/overlay/Modal";
import { useCurrentUserQuery } from "@/modules/auth";
import { hasPermission } from "@/modules/auth/utils/auth.permission";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { isValidEventRange, toValidIsoDate } from "../utils/event.validation";

export function EventsPage() {
  const q = useEventsQuery();
  const { data: currentUser } = useCurrentUserQuery();
  const create = useCreateEventMutation();
  const remove = useDeleteEventMutation();
  const status = useUpdateEventStatusMutation();
  const [open, setOpen] = useState(false), [title, setTitle] = useState(""), [start, setStart] = useState(""), [end, setEnd] = useState("");
  const canManage = hasPermission(currentUser, PERMISSIONS.MANAGE_EVENTS);

  const submit = () => {
    const startIso = toValidIsoDate(start), endIso = toValidIsoDate(end);
    if (!title.trim() || !startIso || !endIso || !isValidEventRange(startIso, endIso)) return;
    create.mutate({ title: title.trim(), startTime: startIso, endTime: endIso }, { onSuccess: () => { setOpen(false); setTitle(""); setStart(""); setEnd(""); } });
  };

  return <main className="space-y-6 p-5"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">Events</h1><p className="text-sm text-slate-500">Reusable calendar/event module.</p></div>{canManage && <Button onClick={() => setOpen(true)}>New event</Button>}</div><div className="overflow-x-auto rounded-2xl border bg-white dark:border-slate-800 dark:bg-slate-900"><table className="min-w-full text-sm"><thead className="bg-slate-50 dark:bg-white/5"><tr><th className="p-3 text-left">Title</th><th className="p-3 text-left">Start</th><th className="p-3 text-left">Status</th><th className="p-3">Actions</th></tr></thead><tbody>{q.data?.events.map(e=><tr key={e._id} className="border-t dark:border-slate-800"><td className="p-3 font-medium">{e.title}</td><td className="p-3">{new Date(e.startTime).toLocaleString()}</td><td className="p-3">{e.status}</td><td className="p-3 text-right">{canManage && <><Button size="sm" variant="ghost" loading={status.isPending} onClick={()=>status.mutate({id:e._id,status:e.status==="scheduled"?"completed":"scheduled"})}>Toggle</Button><Button size="sm" variant="danger" loading={remove.isPending} onClick={()=>remove.mutate(e._id)}>Delete</Button></>}</td></tr>)}</tbody></table></div><Modal open={open} onOpenChange={setOpen} title="Create event"><div className="space-y-4"><input className="w-full rounded-lg border p-3 dark:bg-slate-950" placeholder="Event title" value={title} onChange={e=>setTitle(e.target.value)}/><input type="datetime-local" className="w-full rounded-lg border p-3 dark:bg-slate-950" value={start} onChange={e=>setStart(e.target.value)}/><input type="datetime-local" className="w-full rounded-lg border p-3 dark:bg-slate-950" value={end} onChange={e=>setEnd(e.target.value)}/>{start&&end&&toValidIsoDate(start)&&toValidIsoDate(end)&&!isValidEventRange(start,end)&&<p className="text-sm text-red-600">End time must be after start time.</p>}<Button loading={create.isPending} disabled={!title.trim()||!start||!end||!toValidIsoDate(start)||!toValidIsoDate(end)||!isValidEventRange(start,end)} onClick={submit}>Create</Button></div></Modal></main>
}
export default EventsPage;

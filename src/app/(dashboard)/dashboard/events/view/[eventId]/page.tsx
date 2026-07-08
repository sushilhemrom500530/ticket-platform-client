import EventManage from "@/src/components/event-manage";

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    return (
        <div>
            <EventManage eventId={eventId} />
        </div>
    );
}
import ChatWindow from "@/components/Chat/ChatWindow";

export default function ChatPage() {
    return (
        <div className="min-h-screen bg-black overflow-hidden">
            <ChatWindow userId="demo-user" />
        </div>
    );
}

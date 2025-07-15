import { MessageSquare } from "lucide-react";

export const EmptyState: React.FC<{ searchQuery: string }> = ({
  searchQuery,
}) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <MessageSquare className="w-8 h-8 text-slate-400" />
    </div>
    <p className="text-slate-500 dark:text-slate-400 text-lg">
      {searchQuery ? "No chats found" : "No chats yet"}
    </p>
    {!searchQuery && (
      <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
        Create your first chat to get started
      </p>
    )}
  </div>
);

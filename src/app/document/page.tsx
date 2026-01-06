
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserDocuments } from "../lib/db/queries";

import PastDocument from "../components/PastDocument";
export default async function DocumentsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // We need client interactivity for delete, so this component needs to be client-side
  // BUT you wrote it as an async server component, so we should refactor it to a Client Component
  // or use React hooks inside a client wrapper.
  // Let's rewrite this as a client component below.

  return <PastDocument userId={userId} />;
}

// Client component for interactivity:


/*import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserDocuments } from "../lib/db/queries";
import DocumentCard from "@/components/DocumentCard";
export default async function DocumentsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const docs = await getUserDocuments(userId);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Your documents</h1>

      {docs.length === 0 ? (
        <p className="text-gray-500">No documents yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
}*/

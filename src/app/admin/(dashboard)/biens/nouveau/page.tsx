import Link from "next/link";
import { BienForm } from "../BienForm";

export default function AdminBiensNouveauPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/biens" className="text-sm font-medium text-gray-600 hover:text-[#5c7a1f]">
          ← Retour aux biens
        </Link>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <BienForm />
      </div>
    </div>
  );
}

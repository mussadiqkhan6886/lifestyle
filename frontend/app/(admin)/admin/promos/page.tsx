
"use client";

import { useEffect, useState } from "react";

type Promo = {
  id: number;
  code: string;
  discount: number;
  createdAt: string;
  updatedAt: string;
};

const initialForm = {
  code: "",
  discount: "",
};

export default function PromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // GET ALL PROMOS
  const getPromos = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/promos", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch promos");
      }

      setPromos(data.promos);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPromos();
  }, []);

  // CREATE / UPDATE PROMO
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.code.trim() || !form.discount) {
      setError("Please enter code and discount");
      return;
    }

    const discount = Number(form.discount);

    if (!Number.isInteger(discount) || discount < 1 || discount > 100) {
      setError("Discount must be between 1 and 100");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const isEditing = editingId !== null;

      const res = await fetch(
        isEditing ? `/api/promos/${editingId}` : "/api/promos",
        {
          method: isEditing ? "PATCH" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: form.code.trim().toUpperCase(),
            discount,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save promo");
      }

      setForm(initialForm);
      setEditingId(null);
      await getPromos();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // EDIT PROMO
  const handleEdit = (promo: Promo) => {
    setEditingId(promo.id);

    setForm({
      code: promo.code,
      discount: String(promo.discount),
    });

    setError("");
  };

  // DELETE PROMO
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this promo?")) {
      return;
    }

    try {
      setError("");

      const res = await fetch(`/api/promos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete promo");
      }

      if (editingId === id) {
        handleCancel();
      }

      await getPromos();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(initialForm);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Promo Codes
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage discount promo codes.
          </p>
        </div>

        {/* CREATE / EDIT FORM */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            {editingId ? "Update Promo Code" : "Create Promo Code"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Promo Code
                </label>

                <input
                  type="text"
                  placeholder="e.g. WELCOME20"
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Discount Percentage
                </label>

                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="e.g. 20"
                  value={form.discount}
                  onChange={(e) =>
                    setForm({ ...form, discount: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-600">{error}</p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Promo"
                    : "Create Promo"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* PROMO TABLE */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              All Promo Codes
            </h2>

            <span className="text-sm text-gray-500">
              {promos.length} total
            </span>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-gray-500">
              Loading promo codes...
            </div>
          ) : promos.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500">
              No promo codes found. Create your first promo code above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Promo Code</th>
                    <th className="px-6 py-4 font-medium">Discount</th>
                    <th className="px-6 py-4 font-medium">Created</th>
                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {promos.map((promo) => (
                    <tr key={promo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="rounded-md bg-gray-100 px-3 py-1.5 font-semibold tracking-wide text-gray-900">
                          {promo.code}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-900">
                        {promo.discount}%
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {new Date(promo.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(promo)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium hover:bg-gray-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(promo.id)}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

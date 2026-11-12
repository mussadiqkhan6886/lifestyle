'use client';

import { PropsAI, generateAi } from '@/server/ai';
import { useMutation } from '@tanstack/react-query';
import { Sparkle } from 'lucide-react';
import { toast } from 'sonner';

interface GenerateDescProps extends PropsAI {
  onGenerated: (description: string) => void;
}

const GenerateDesc = ({
  productName,
  description,
  onGenerated,
}: GenerateDescProps) => {

  const mutation = useMutation({
    mutationFn: () => generateAi({ productName, description }),

    onError: (error) => {
      toast.error(error.message, { id: "ai" });
    },

    onSuccess: (data) => {
      toast.success("Description generated", { id: "ai" });
      onGenerated(data);
    },

    onMutate: () => {
      toast.loading("AI is thinking...", { id: "ai" });
    }
  });

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="rounded-xl flex gap-1 items-center bg-purple-600 px-4 py-2 text-white disabled:opacity-40 cursor-pointer"
    >
      <Sparkle
        size={16}
        className={mutation.isPending ? "animate-spin" : ""}
      />

      {mutation.isPending ? "Generating..." : "Generate"}
    </button>
  );
};

export default GenerateDesc;
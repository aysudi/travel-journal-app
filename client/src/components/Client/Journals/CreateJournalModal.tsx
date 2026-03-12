import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { CreateJournalEntryData, Destination } from "../../../services";
import { useUserProfile } from "../../../hooks/useAuth";
import Loading from "../../Common/Loading";
import { useLimitCheck } from "../../../hooks/useLimits";
import PremiumUpgradeModal from "../../Common/PremiumUpgradeModal";
import JournalForm from "./JournalForm";

interface CreateJournalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJournalEntryData) => void;
  destinations: Destination[];
  loading?: boolean;
}

const CreateJournalModal: React.FC<CreateJournalModalProps> = ({
  open,
  onClose,
  onSubmit,
  destinations,
  loading = false,
}) => {
  const { data: user } = useUserProfile();
  const { checkJournalEntryLimit } = useLimitCheck();
  const journalLimit = checkJournalEntryLimit();

  if (!user) return <Loading />;

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Check journal entry limit on open
  useEffect(() => {
    if (open && !journalLimit.canCreate) {
      setShowUpgradeModal(true);
    }
  }, [open, journalLimit.canCreate]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
          onClick={onClose}
          disabled={loading}
        >
          <X size={22} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">
          Create New Journal Entry
        </h2>
        <JournalForm
          journalLimit={journalLimit}
          setShowUpgradeModal={setShowUpgradeModal}
          onSubmit={onSubmit}
          destinations={destinations}
          loading={loading}
        />
      </div>

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="journals"
        currentUsage={journalLimit.usage}
        limit={journalLimit.limit}
      />
    </div>
  );
};

export default CreateJournalModal;

import { BookOpen, Plus } from "lucide-react";
import type { JournalEntry } from "../../../services";
import DestinationsTabs from "./DestinationsTabs";
import JournalsTabs from "./JournalsTabs";
import NavigationTabs from "./NavigationTabs";
import CreateJournalModal from "../Journals/CreateJournalModal";
import PhotosTab from "./PhotosTab";
import { useState } from "react";
import { useCreateJournalEntry } from "../../../hooks/useEntries";
import Swal from "sweetalert2";

const Navigation = ({
  handleDestinationClick,
  destinationsArray,
  journalsArray,
  setShowAddDestination,
  getDestinationStatus,
  getStatusColor,
  setJournalsArrayState,
  listId,
  journals,
}: any) => {
  const [showCreateJournal, setShowCreateJournal] = useState(false);
  const createJournal = useCreateJournalEntry();

  const [activeTab, setActiveTab] = useState<
    "destinations" | "journals" | "photos"
  >("destinations");

  return (
    <div className="bg-white rounded-2xl shadow-xl mb-8">
      <NavigationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        destinationsArray={destinationsArray}
        journalsArray={journalsArray}
      />

      {/* Tab Content */}
      <div className="p-6">
        {/* Destinations Tab */}
        {activeTab === "destinations" && (
          <DestinationsTabs
            setShowAddDestination={setShowAddDestination}
            getStatusColor={getStatusColor}
            getDestinationStatus={getDestinationStatus}
            handleDestinationClick={handleDestinationClick}
            destinationsArray={destinationsArray}
          />
        )}

        {/* Journals Tab */}
        {activeTab === "journals" && (
          <div>
            <div className="space-y-6">
              {(journalsArray as JournalEntry[]).map(
                (journal: JournalEntry, idx: number) => {
                  return (
                    <JournalsTabs
                      key={idx}
                      journal={journal}
                      listId={listId}
                      onDelete={(id: string) => {
                        setJournalsArrayState((prev: any[]) =>
                          prev.filter((j) => j.id !== id)
                        );
                      }}
                    />
                  );
                }
              )}
            </div>

            {/* Empty State for Journals */}
            {(journalsArray as JournalEntry[]).length === 0 && (
              <div className="text-center py-12">
                <BookOpen size={64} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No journals yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start documenting your travel experiences by creating your
                  first journal entry
                </p>
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                  onClick={() => setShowCreateJournal(true)}
                >
                  <Plus size={20} />
                  <span>Write Your First Journal</span>
                </button>
              </div>
            )}
            {(journalsArray as JournalEntry[]).length > 0 && (
              <div className="text-center py-12">
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                  onClick={() => setShowCreateJournal(true)}
                >
                  <Plus size={20} />
                  <span>Add Journal</span>
                </button>
              </div>
            )}
            {/* Create Journal Modal */}
            {showCreateJournal && (
              <CreateJournalModal
                open={showCreateJournal}
                onClose={() => setShowCreateJournal(false)}
                destinations={destinationsArray}
                loading={createJournal.isPending}
                onSubmit={async (data) => {
                  await createJournal.mutateAsync(data, {
                    onSuccess: (newEntry) => {
                      setShowCreateJournal(false);
                      setJournalsArrayState((prev: any) => [
                        newEntry,
                        ...(prev.length > 0 ? prev : journals || []),
                      ]);
                      Swal.fire({
                        title: "Journal created successfully!",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                      });
                    },
                  });
                }}
              />
            )}
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === "photos" && (
          <PhotosTab
            destinationsArray={destinationsArray}
            journalsArray={journalsArray}
          />
        )}
      </div>
    </div>
  );
};

export default Navigation;

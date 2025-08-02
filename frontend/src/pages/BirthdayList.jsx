import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  XCircle,
  Filter,
  Calendar,
  User,
  Gift,
  Cake,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import BirthdayModal from "../components/BirthdayModal";
import {
  getBirthdays,
  addBirthday,
  updateBirthday,
  deleteBirthday,
} from "../services/birthdayService.js";
import Loading from "../components/Loading.jsx";
import { handleSuccess } from "../utils/toast.js";

function BirthdayList() {
  const [birthdays, setBirthdays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [birthdayToDelete, setBirthdayToDelete] = useState(null);

  // Filters
  const [filterMonth, setFilterMonth] = useState("");
  const [filterRelation, setFilterRelation] = useState("");

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const fetchBirthdays = async () => {
    try {
      const res = await getBirthdays();
      setBirthdays(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch birthdays:", err.message);
      setBirthdays([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBirthday = () => {
    setEditingBirthday(null);
    setShowModal(true);
  };

  const handleEditBirthday = (birthday) => {
    setEditingBirthday(birthday);
    setShowModal(true);
  };

  const handleDeleteClick = (birthday) => {
    setBirthdayToDelete(birthday);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!birthdayToDelete) return;

    setDeletingId(birthdayToDelete._id);
    try {
      await deleteBirthday(birthdayToDelete._id);
      handleSuccess("🗑️ Birthday deleted successfully");
      fetchBirthdays();
    } catch (err) {
      console.error("Failed to delete birthday:", err.message);
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(false);
      setBirthdayToDelete(null);
    }
  };

  const handleSaveBirthday = async (birthdayData) => {
    try {
      if (editingBirthday) {
        await updateBirthday(editingBirthday._id, birthdayData);
      } else {
        await addBirthday(birthdayData);
      }
      fetchBirthdays();
    } catch (err) {
      console.error("Failed to save birthday:", err.message);
    }
    setShowModal(false);
    setEditingBirthday(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterMonth("");
    setFilterRelation("");
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysUntilBirthday = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    const thisYearBirthday = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );

    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = thisYearBirthday - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getRelationConfig = (relation) => {
    const configs = {
      Friend: {
        bg: "from-blue-400/10 to-cyan-400/10 dark:from-blue-600/20 dark:to-cyan-600/20",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-600/30",
        icon: "👥",
      },
      Family: {
        bg: "from-green-400/10 to-emerald-400/10 dark:from-green-600/20 dark:to-emerald-600/20",
        text: "text-green-700 dark:text-green-300",
        border: "border-green-200 dark:border-green-600/30",
        icon: "👨‍👩‍👧‍👦",
      },
      Colleague: {
        bg: "from-yellow-400/10 to-orange-400/10 dark:from-yellow-600/20 dark:to-orange-600/20",
        text: "text-yellow-700 dark:text-yellow-300",
        border: "border-yellow-200 dark:border-yellow-600/30",
        icon: "💼",
      },
      Partner: {
        bg: "from-pink-400/10 to-rose-400/10 dark:from-pink-600/20 dark:to-rose-600/20",
        text: "text-pink-700 dark:text-pink-300",
        border: "border-pink-200 dark:border-pink-600/30",
        icon: "💕",
      },
      Other: {
        bg: "from-gray-400/10 to-slate-400/10 dark:from-gray-600/20 dark:to-slate-600/20",
        text: "text-gray-700 dark:text-gray-300",
        border: "border-gray-200 dark:border-gray-600/30",
        icon: "🤝",
      },
    };
    return configs[relation] || configs.Other;
  };

  const filteredBirthdays = birthdays
    .filter((b) => {
      const matchesSearch =
        b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.note?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMonth =
        !filterMonth ||
        new Date(b.birthdate).getMonth().toString() === filterMonth;

      const matchesRelation = !filterRelation || b.relation === filterRelation;

      return matchesSearch && matchesMonth && matchesRelation;
    })
    .sort(
      (a, b) =>
        getDaysUntilBirthday(a.birthdate) - getDaysUntilBirthday(b.birthdate)
    );

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });

  const getAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (loading) return <Loading />;

  return (
    <>
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Birthday
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <strong>{birthdayToDelete?.name}</strong>'s birthday?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setBirthdayToDelete(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingId === birthdayToDelete?._id}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {deletingId === birthdayToDelete?._id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto p-4 lg:p-6 pb-20 lg:pb-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white">
                    All Birthdays
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage all your saved birthdays ({birthdays.length} total)
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleAddBirthday}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Birthday</span>
            </button>
          </div>

          {/* Search + Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Month Filter */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="">All Months</option>
                  {monthNames.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Relation Filter */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  value={filterRelation}
                  onChange={(e) => setFilterRelation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="">All Relations</option>
                  <option value="Friend">👥 Friend</option>
                  <option value="Family">👨‍👩‍👧‍👦 Family</option>
                  <option value="Colleague">💼 Colleague</option>
                  <option value="Partner">💕 Partner</option>
                  <option value="Other">🤝 Other</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span className="font-medium">Clear</span>
              </button>
            </div>
          </div>

          {/* Birthday List */}
          <div className="space-y-4">
            {filteredBirthdays.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  No birthdays found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm || filterMonth || filterRelation
                    ? "Try adjusting your filters or search terms."
                    : "Start adding birthdays to build your celebration list!"}
                </p>
                {!searchTerm && !filterMonth && !filterRelation && (
                  <button
                    onClick={handleAddBirthday}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Add Your First Birthday</span>
                  </button>
                )}
              </div>
            ) : (
              filteredBirthdays.map((birthday) => {
                const daysUntil = getDaysUntilBirthday(birthday.birthdate);
                const isToday = daysUntil === 0;
                const relationConfig = getRelationConfig(birthday.relation);

                return (
                  <div
                    key={birthday._id}
                    className={`group bg-white dark:bg-gray-800 rounded-lg shadow-sm border transition-colors ${
                      isToday
                        ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    {isToday && (
                      <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-medium">
                        <Sparkles className="w-3 h-3" />
                        <span>TODAY</span>
                      </div>
                    )}

                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="relative">
                            {birthday.imageUrl ? (
                              <img
                                src={birthday.imageUrl}
                                alt={birthday.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                              </div>
                            )}
                            {isToday && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                <PartyPopper className="w-2 h-2 text-yellow-900" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                                {birthday.name}
                              </h3>
                              {isToday && (
                                <Cake className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>

                            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(birthday.birthdate)}</span>
                              </div>
                              <span>•</span>
                              <span>Age {getAge(birthday.birthdate)}</span>
                            </div>

                            <div className="flex items-center space-x-3">
                              <div
                                className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${relationConfig.bg} ${relationConfig.text} border ${relationConfig.border}`}
                              >
                                <span>{relationConfig.icon}</span>
                                <span>{birthday.relation}</span>
                              </div>

                              <div
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  isToday
                                    ? "bg-yellow-400 text-yellow-900"
                                    : daysUntil <= 7
                                    ? "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {isToday ? "🎉 Today!" : `${daysUntil} days`}
                              </div>
                            </div>

                            {birthday.note && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md mt-2 line-clamp-2">
                                <Gift className="w-3 h-3 inline mr-2 text-purple-500" />
                                {birthday.note}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 ml-4 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditBirthday(birthday)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit Birthday"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(birthday)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete Birthday"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Floating Add Button */}
          <button
            onClick={handleAddBirthday}
            className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>

          {/* Modal */}
          {showModal && (
            <BirthdayModal
              birthday={editingBirthday}
              onSave={handleSaveBirthday}
              onClose={() => {
                setShowModal(false);
                setEditingBirthday(null);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default BirthdayList;

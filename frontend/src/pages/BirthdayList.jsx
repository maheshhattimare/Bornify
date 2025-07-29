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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-red-200/50 dark:border-red-700/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
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
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingId === birthdayToDelete?._id}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-70"
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

      <div className="min-h-screen bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-black">
        <div className="max-w-7xl mx-auto p-4 lg:p-8 pb-20 lg:pb-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    All Birthdays
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Manage all your saved birthdays ({birthdays.length} total)
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleAddBirthday}
              className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold">Add Birthday</span>
            </button>
          </div>

          {/* Search + Filters */}
          <div className="bg-white/60 dark:bg-gray-900/90 backdrop-blur-lg rounded-3xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700 rounded-xl focus:border-pink-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-pink-400/20 dark:focus:ring-purple-400/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Month Filter */}
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700 rounded-xl focus:border-pink-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-pink-400/20 dark:focus:ring-purple-400/20 text-gray-900 dark:text-white appearance-none cursor-pointer"
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
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={filterRelation}
                  onChange={(e) => setFilterRelation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700 rounded-xl focus:border-pink-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-pink-400/20 dark:focus:ring-purple-400/20 text-gray-900 dark:text-white appearance-none cursor-pointer"
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
                className="group flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <XCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-medium">Clear</span>
              </button>
            </div>
          </div>

          {/* Birthday List */}
          <div className="space-y-4">
            {filteredBirthdays.length === 0 ? (
              <div className="text-center py-16 bg-white/60 dark:bg-gray-900/90 backdrop-blur-lg rounded-3xl border border-gray-200/50 dark:border-gray-700">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Calendar className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  No birthdays found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                  {searchTerm || filterMonth || filterRelation
                    ? "Try adjusting your filters or search terms."
                    : "Start adding birthdays to build your celebration list!"}
                </p>
                {!searchTerm && !filterMonth && !filterRelation && (
                  <button
                    onClick={handleAddBirthday}
                    className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-semibold text-lg">
                      Add Your First Birthday
                    </span>
                  </button>
                )}
              </div>
            ) : (
              filteredBirthdays.map((birthday, index) => {
                const daysUntil = getDaysUntilBirthday(birthday.birthdate);
                const isToday = daysUntil === 0;
                const relationConfig = getRelationConfig(birthday.relation);

                return (
                  <div
                    key={birthday._id}
                    className={`group relative overflow-hidden bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg rounded-3xl shadow-lg border hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${
                      isToday
                        ? "border-yellow-400/60 ring-2 ring-yellow-400/30 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20"
                        : "border-gray-200/50 dark:border-gray-700"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {isToday && (
                      <div className="absolute top-4 right-4 flex items-center space-x-2 px-3 py-1 bg-yellow-400 text-yellow-900 dark:bg-yellow-500 dark:text-black rounded-full text-sm font-bold shadow-lg animate-pulse">
                        <Sparkles className="w-4 h-4" />
                        <span>TODAY!</span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="relative">
                            {birthday.imageUrl ? (
                              <img
                                src={birthday.imageUrl}
                                alt={birthday.name}
                                className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-2 ring-white/50"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <User className="w-8 h-8 text-white" />
                              </div>
                            )}
                            {isToday && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center">
                                <PartyPopper className="w-3 h-3 text-yellow-900 dark:text-black animate-bounce" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                                {birthday.name}
                              </h3>
                              {isToday && (
                                <Cake className="w-5 h-5 text-yellow-500 animate-bounce" />
                              )}
                            </div>

                            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 mb-3">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">
                                  {formatDate(birthday.birthdate)}
                                </span>
                              </div>
                              <span>•</span>
                              <span>Age {getAge(birthday.birthdate)}</span>
                            </div>

                            <div className="flex items-center space-x-3">
                              <div
                                className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${relationConfig.bg} ${relationConfig.text} border ${relationConfig.border}`}
                              >
                                <span>{relationConfig.icon}</span>
                                <span>{birthday.relation}</span>
                              </div>

                              <div
                                className={`px-3 py-1 rounded-full text-sm font-bold ${
                                  isToday
                                    ? "bg-yellow-400 text-yellow-900 dark:bg-yellow-500 dark:text-black"
                                    : daysUntil <= 7
                                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {isToday ? "🎉 Today!" : `${daysUntil} days`}
                              </div>
                            </div>

                            {birthday.note && (
                              <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100/50 dark:bg-gray-800/50 px-3 py-2 rounded-lg mt-3 line-clamp-2">
                                <Gift className="w-4 h-4 inline mr-2 text-pink-500" />
                                {birthday.note}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => handleEditBirthday(birthday)}
                            className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-200 hover:scale-110"
                            title="Edit Birthday"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(birthday)}
                            className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200 hover:scale-110"
                            title="Delete Birthday"
                          >
                            <Trash2 className="w-5 h-5" />
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
            className="lg:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 transition-all duration-300 animate-bounce"
          >
            <Plus className="w-7 h-7" />
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

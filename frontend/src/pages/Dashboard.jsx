import { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  Gift,
  User,
  List,
  Edit3,
  Trash2,
  PartyPopper,
  Cake,
  Heart,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BirthdayModal from "../components/BirthdayModal.jsx";
import UserDOBModal from "../components/UserDOBModal.jsx";
import {
  addBirthday,
  getBirthdays,
  updateBirthday,
  deleteBirthday,
} from "../services/birthdayService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { updateDob } from "../services/userService.js";
import Loading from "../components/Loading.jsx";

const Dashboard = () => {
  const { user, loadingUser, setUser } = useAuth();
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState(null);
  const [showDobModal, setShowDobModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [birthdayToDelete, setBirthdayToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch birthdays on mount
  useEffect(() => {
    fetchBirthdays();
  }, []);

  // Show DOB modal if missing
  useEffect(() => {
    if (!loadingUser && user && !user.dob) {
      setTimeout(() => {
        setShowDobModal(true);
      }, 2000);
    }
  }, [user, loadingUser]);

  const fetchBirthdays = async () => {
    try {
      const res = await getBirthdays();
      setBirthdays(res?.data || res || []);
    } catch (err) {
      setError("Failed to load birthdays");
    } finally {
      setLoading(false);
    }
  };

  // Save new or updated birthday
  const handleSaveBirthday = async (formData) => {
    try {
      if (editingBirthday) {
        await updateBirthday(editingBirthday._id, formData);
      } else {
        await addBirthday(formData);
      }
      fetchBirthdays();
    } catch (err) {
      alert(err.message || "Error saving birthday");
    }
    setShowModal(false);
    setEditingBirthday(null);
  };

  // Save DOB for logged-in user
  const handleSaveDob = async (dob) => {
    try {
      const updated = await updateDob(dob);
      setUser((prev) => ({
        ...prev,
        dob: updated.user.dob,
      }));
      setShowDobModal(false);
    } catch (err) {
      alert(err.message || "Error updating DOB");
    }
  };

  // Handle delete confirmation
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
      alert(err.message || "Error deleting birthday");
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(false);
      setBirthdayToDelete(null);
    }
  };

  // Filter upcoming birthdays
  const getUpcomingBirthdays = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    return birthdays
      .filter((birthday) => {
        if (!birthday.birthdate) return false;

        const birthDate = new Date(birthday.birthdate);
        const thisYearBirthday = new Date(
          today.getFullYear(),
          birthDate.getMonth(),
          birthDate.getDate()
        );
        if (thisYearBirthday < today) {
          thisYearBirthday.setFullYear(today.getFullYear() + 1);
        }
        return thisYearBirthday <= thirtyDaysFromNow;
      })
      .sort((a, b) => {
        const aDate = new Date(a.birthdate);
        const bDate = new Date(b.birthdate);
        const aThisYear = new Date(
          today.getFullYear(),
          aDate.getMonth(),
          aDate.getDate()
        );
        const bThisYear = new Date(
          today.getFullYear(),
          bDate.getMonth(),
          bDate.getDate()
        );
        return aThisYear - bThisYear;
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

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

  const getTodaysBirthdays = () => {
    const today = new Date();
    return birthdays.filter((b) => {
      const birthDate = new Date(b.birthdate);
      return (
        today.getMonth() === birthDate.getMonth() &&
        today.getDate() === birthDate.getDate()
      );
    });
  };

  const upcomingBirthdays = getUpcomingBirthdays();
  const todaysBirthdays = getTodaysBirthdays();

  if (loading) return <Loading />;

  return (
    <>
      {/* DOB Modal */}
      <UserDOBModal
        isOpen={showDobModal}
        onClose={() => setShowDobModal(false)}
        onSave={handleSaveDob}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-red-200/50 dark:border-red-700/30">
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
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors duration-200"
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
          {/* Welcome Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 dark:from-pink-600 dark:via-purple-700 dark:to-indigo-700 rounded-3xl p-8 mb-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <PartyPopper className="w-8 h-8 text-yellow-300 animate-bounce" />
                <h1 className="text-2xl lg:text-3xl font-bold">
                  Welcome back,{" "}
                  {user
                    ? `${
                        user.name.split(" ")[0].charAt(0).toUpperCase() +
                        user.name.split(" ")[0].slice(1).toLowerCase()
                      }`
                    : ""}
                  ! 👋
                </h1>
              </div>
              <p className="text-white/90 text-lg">
                You have{" "}
                <span className="font-bold text-yellow-300">
                  {upcomingBirthdays.length}
                </span>{" "}
                upcoming birthdays in the next 30 days
              </p>
              {todaysBirthdays.length > 0 && (
                <div className="mt-4 p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Cake className="w-5 h-5 text-yellow-300" />
                    <span className="font-semibold">
                      🎉 Today's Celebrations!
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {todaysBirthdays.map((birthday) => (
                      <span
                        key={birthday._id}
                        className="px-3 py-1 bg-white/30 rounded-full text-sm font-medium"
                      >
                        {birthday.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg dark:shadow-purple-900/20 border border-pink-200/50 dark:border-purple-600/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Total Birthdays
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {birthdays.length}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg dark:shadow-purple-900/20 border border-green-200/50 dark:border-green-600/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Upcoming
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {upcomingBirthdays.length}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Gift className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg dark:shadow-purple-900/20 border border-blue-200/50 dark:border-blue-600/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Today
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {todaysBirthdays.length}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Cake className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/birthdays")}
              className="group flex items-center space-x-3 px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg text-gray-700 dark:text-gray-300 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-600/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <List className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium">View All Birthdays</span>
            </button>

            <button
              onClick={() => {
                setEditingBirthday(null);
                setShowModal(true);
              }}
              className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium">Add Birthday</span>
            </button>
          </div>

          {/* Birthday List */}
          {!loading && !error && (
            <div className="space-y-6">
              {upcomingBirthdays.length === 0 ? (
                <div className="text-center py-16 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl border border-gray-200/50 dark:border-gray-600/30">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Gift className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    No upcoming birthdays
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                    Start celebrating! Add some birthdays to get started.
                  </p>
                  <button
                    onClick={() => {
                      setEditingBirthday(null);
                      setShowModal(true);
                    }}
                    className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-semibold text-lg">
                      Add Your First Birthday
                    </span>
                  </button>
                </div>
              ) : (
                upcomingBirthdays.map((birthday, index) => {
                  const daysUntil = getDaysUntilBirthday(birthday.birthdate);
                  const isToday = daysUntil === 0;

                  return (
                    <div
                      key={birthday._id}
                      className={`group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-lg border hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${
                        isToday
                          ? "border-yellow-400/60 ring-2 ring-yellow-400/30 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20"
                          : "border-gray-200/50 dark:border-gray-600/30"
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {isToday && (
                        <div className="absolute top-4 right-4 flex items-center space-x-2 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold shadow-lg animate-pulse">
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
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                  <Heart className="w-3 h-3 text-yellow-900 animate-pulse" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                                {birthday.name}
                              </h3>
                              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">
                                  {formatDate(birthday.birthdate)}
                                </span>
                                <span>•</span>
                                <span className="capitalize">
                                  {birthday.relation}
                                </span>
                              </div>
                              {birthday.note && (
                                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100/50 dark:bg-gray-700/50 px-3 py-1 rounded-lg mt-2 line-clamp-2">
                                  {birthday.note}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end space-y-3 ml-4">
                            <div className="text-center">
                              <div
                                className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${
                                  isToday
                                    ? "bg-yellow-400 text-yellow-900"
                                    : daysUntil <= 7
                                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {isToday ? "Today!" : `${daysUntil} days`}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={() => {
                                  setEditingBirthday(birthday);
                                  setShowModal(true);
                                }}
                                className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-200 hover:scale-110"
                                title="Edit Birthday"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(birthday)}
                                className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200 hover:scale-110"
                                title="Delete Birthday"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Floating Add Button */}
          <button
            onClick={() => {
              setEditingBirthday(null);
              setShowModal(true);
            }}
            className="lg:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 transition-all duration-300 animate-bounce"
          >
            <Plus className="w-7 h-7" />
          </button>

          {/* Add/Edit Birthday Modal */}
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
};

export default Dashboard;

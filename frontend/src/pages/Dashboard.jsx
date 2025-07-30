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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full shadow-xl border border-gray-200 dark:border-slate-700">
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
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
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
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 mb-6 text-white">
            <div className="flex items-center space-x-3 mb-3">
              <PartyPopper className="w-6 h-6 text-yellow-300" />
              <h1 className="text-xl lg:text-2xl font-semibold">
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
            <p className="text-white/90">
              You have{" "}
              <span className="font-semibold text-yellow-300">
                {upcomingBirthdays.length}
              </span>{" "}
              upcoming birthdays in the next 30 days
            </p>
            {todaysBirthdays.length > 0 && (
              <div className="mt-4 p-4 bg-white/15 rounded-lg border border-white/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Cake className="w-5 h-5 text-yellow-300" />
                  <span className="font-medium">🎉 Today's Celebrations!</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {todaysBirthdays.map((birthday) => (
                    <span
                      key={birthday._id}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
                    >
                      {birthday.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Total Birthdays
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                    {birthdays.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Upcoming
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                    {upcomingBirthdays.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Gift className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Today
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                    {todaysBirthdays.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Cake className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
            <button
              onClick={() => navigate("/birthdays")}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <List className="w-5 h-5" />
              <span className="font-medium">View All Birthdays</span>
            </button>

            <button
              onClick={() => {
                setEditingBirthday(null);
                setShowModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Birthday</span>
            </button>
          </div>

          {/* Birthday List */}
          {!loading && !error && (
            <div className="space-y-4">
              {upcomingBirthdays.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    No upcoming birthdays
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start celebrating! Add some birthdays to get started.
                  </p>
                  <button
                    onClick={() => {
                      setEditingBirthday(null);
                      setShowModal(true);
                    }}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Add Your First Birthday</span>
                  </button>
                </div>
              ) : (
                upcomingBirthdays.map((birthday) => {
                  const daysUntil = getDaysUntilBirthday(birthday.birthdate);
                  const isToday = daysUntil === 0;

                  return (
                    <div
                      key={birthday._id}
                      className={`group bg-white dark:bg-slate-800 rounded-lg shadow-sm border transition-colors ${
                        isToday
                          ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10"
                          : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
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
                                  <Heart className="w-2 h-2 text-yellow-900" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 truncate">
                                {birthday.name}
                              </h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(birthday.birthdate)}</span>
                                <span>•</span>
                                <span className="capitalize">
                                  {birthday.relation}
                                </span>
                              </div>
                              {birthday.note && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-700 px-3 py-1 rounded-md mt-2 line-clamp-2">
                                  {birthday.note}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 ml-4">
                            <div className="text-center">
                              <div
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  isToday
                                    ? "bg-yellow-400 text-yellow-900"
                                    : daysUntil <= 7
                                    ? "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {isToday ? "Today!" : `${daysUntil} days`}
                              </div>
                            </div>

                            <div className="flex items-center space-x-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingBirthday(birthday);
                                  setShowModal(true);
                                }}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Edit Birthday"
                              >
                                <Edit3 className="w-4 h-4" />
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
            className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-colors"
          >
            <Plus className="w-6 h-6" />
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

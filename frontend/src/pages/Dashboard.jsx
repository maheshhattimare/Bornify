import { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  Gift,
  User,
  LogOut,
  Sun,
  Moon,
  List,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BirthdayModal from "../components/BirthdayModal.jsx";
import {
  addBirthday,
  getBirthdays,
  updateBirthday,
  deleteBirthday,
} from "../services/birthdayService.js";
import { useTheme } from "../hooks/useTheme.js";
import BirthdayList from "./BirthdayList.jsx";

const Dashboard = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState(null);
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/login");
    }, 200);
  };

  // Fetch birthdays on mount
  useEffect(() => {
    fetchBirthdays();
  }, []);

  const fetchBirthdays = async () => {
    setLoading(true);
    try {
      const res = await getBirthdays();
      setBirthdays(res?.data || res || []);
    } catch (err) {
      setError("Failed to load birthdays");
    } finally {
      setLoading(false);
    }
  };

  // Save birthday
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

  // Delete birthday
  const handleDeleteBirthday = async (id) => {
    if (!window.confirm("Are you sure you want to delete this birthday?"))
      return;
    try {
      await deleteBirthday(id);
      fetchBirthdays();
    } catch (err) {
      alert(err.message || "Error deleting birthday");
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
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
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

  const upcomingBirthdays = getUpcomingBirthdays();

  return (
    <div className="p-4 lg:p-8 pb-20 lg:pb-8">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold">Bornify 🎉</h1>
        <div className="flex gap-3">
          {/* Theme Switch */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
          >
            <Sun className="h-5 w-5 dark:hidden" />
            <Moon className="h-5 w-5 hidden dark:block" />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200"
          >
            <LogOut className="h-5 w-5 text-red-600" />
          </button>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 mb-8 text-white">
        <h1 className="text-xl lg:text-2xl font-bold mb-2">Welcome back! 👋</h1>
        <p>
          You have {upcomingBirthdays.length} upcoming birthdays in the next 30
          days
        </p>
      </div>

      {loading && <p className="text-gray-500">Loading birthdays...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 flex items-center">
          <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <Calendar className="h-8 w-8 text-primary-600" />
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold">{upcomingBirthdays.length}</p>
            <p>Upcoming</p>
          </div>
        </div>

        <div className="card p-6 flex items-center">
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <Gift className="h-8 w-8 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold">{birthdays.length}</p>
            <p>Total Birthdays</p>
          </div>
        </div>

        <div className="card p-6 flex items-center">
          <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
            <User className="h-8 w-8 text-amber-600" />
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold">
              {
                new Set(birthdays.map((b) => new Date(b.birthdate).getMonth()))
                  .size
              }
            </p>
            <p>Active Months</p>
          </div>
        </div>
      </div>

      {/* View All Birthdays Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/birthdays")}
          className="btn-secondary flex items-center gap-2"
        >
          <List className="h-4 w-4" />
          View All Birthdays
        </button>
      </div>

      {/* Upcoming Birthdays */}
      <div className="card p-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">Upcoming Birthdays</h2>
          <button
            onClick={() => {
              setEditingBirthday(null);
              setShowModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Birthday
          </button>
        </div>

        {upcomingBirthdays.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium">No upcoming birthdays</h3>
            <button
              onClick={() => {
                setEditingBirthday(null);
                setShowModal(true);
              }}
              className="btn-primary mt-4"
            >
              Add Your First Birthday
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBirthdays.map((birthday) => {
              const daysUntil = getDaysUntilBirthday(birthday.birthdate);
              return (
                <div
                  key={birthday._id}
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => setEditingBirthday(birthday)}
                >
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold">
                        {birthday.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold">{birthday.name}</h3>
                    <p>{formatDate(birthday.birthdate)}</p>
                    {birthday.relation && (
                      <p className="text-sm text-gray-500">
                        {birthday.relation}
                      </p>
                    )}
                    {birthday.note && (
                      <p className="text-sm text-gray-500">{birthday.note}</p>
                    )}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      daysUntil === 0
                        ? "bg-red-100 text-red-800"
                        : daysUntil <= 7
                        ? "bg-amber-100 text-amber-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {daysUntil === 0 ? "Today!" : `${daysUntil} days`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => {
          setEditingBirthday(null);
          setShowModal(true);
        }}
        className="lg:hidden fixed bottom-6 right-6 h-14 w-14 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center"
      >
        <Plus className="h-6 w-6" />
      </button>

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
  );
};

export default Dashboard;

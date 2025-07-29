import {useState, useEffect} from "react";
import {
    Plus,
    Calendar,
    Gift,
    User,
    LogOut,
    Sun,
    Moon,
    List
} from "lucide-react";
import {useNavigate} from "react-router-dom";
import BirthdayModal from "../components/BirthdayModal.jsx";
import UserDOBModal from "../components/UserDOBModal.jsx";
import {addBirthday, getBirthdays, updateBirthday, deleteBirthday} from "../services/birthdayService.js";
import {useTheme} from "../hooks/useTheme.js";
import {useAuth} from "../context/AuthContext.jsx";
import {updateDob} from "../services/userService.js";

const Dashboard = () => {
    const {user, loadingUser, setUser} = useAuth();
    const [birthdays, setBirthdays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingBirthday, setEditingBirthday] = useState(null);
    const [showDobModal, setShowDobModal] = useState(false);
    const {theme, toggleTheme} = useTheme();
    const navigate = useNavigate();

    // Logout
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

    // Show DOB modal if missing
    useEffect(() => {
        if (!loadingUser && user && !user.dob) {
            setTimeout(() => {
                setShowDobModal(true);
            }, 2000);
        }
    }, [user, loadingUser]);

    const fetchBirthdays = async () => {
        setLoading(true);
        try {
            const res = await getBirthdays();
            setBirthdays(res ?. data || res || []);
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
            } fetchBirthdays();
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
                dob: updated.user.dob
            }));
            setShowDobModal(false);
        } catch (err) {
            alert(err.message || "Error updating DOB");
        }
    };

    // Filter upcoming birthdays
    const getUpcomingBirthdays = () => {
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

        return birthdays.filter((birthday) => {
            if (!birthday.birthdate) 
                return false;
            


            const birthDate = new Date(birthday.birthdate);
            const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
            if (thisYearBirthday < today) {
                thisYearBirthday.setFullYear(today.getFullYear() + 1);
            }
            return thisYearBirthday <= thirtyDaysFromNow;
        }).sort((a, b) => {
            const aDate = new Date(a.birthdate);
            const bDate = new Date(b.birthdate);
            const aThisYear = new Date(today.getFullYear(), aDate.getMonth(), aDate.getDate());
            const bThisYear = new Date(today.getFullYear(), bDate.getMonth(), bDate.getDate());
            return aThisYear - bThisYear;
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric"
        });
    };

    const getDaysUntilBirthday = (dateString) => {
        const today = new Date();
        const birthDate = new Date(dateString);
        const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (thisYearBirthday < today) {
            thisYearBirthday.setFullYear(today.getFullYear() + 1);
        }
        const diffTime = thisYearBirthday - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const upcomingBirthdays = getUpcomingBirthdays();

    return (<> {/* DOB Modal */}
        <UserDOBModal isOpen={showDobModal}
            onClose={
                () => setShowDobModal(false)
            }
            onSave={handleSaveDob}/>

        <div className="p-4 lg:p-8 pb-20 lg:pb-8"> {/* Top Bar */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold">Bornify 🎉</h1>
                <div className="flex gap-3"> {/* Theme Switch */}
                    <button onClick={toggleTheme}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200">
                        <Sun className="h-5 w-5 dark:hidden"/>
                        <Moon className="h-5 w-5 hidden dark:block"/>
                    </button>

                    {/* Logout */}
                    <button onClick={handleLogout}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200">
                        <LogOut className="h-5 w-5 text-red-600"/>
                    </button>
                </div>
            </div>

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 mb-8 text-white">
                <h1 className="text-xl lg:text-2xl font-bold mb-2">
                    Welcome back! 👋
                </h1>
                <p>
                    You have {
                    upcomingBirthdays.length
                }
                    {" "}upcoming birthdays in the next
                                                                                                                            30 days
                </p>
            </div>

            {/* Birthdays Section */}
            {
            loading && <p className="text-gray-500">Loading birthdays...</p>
        }
            {
            error && <p className="text-red-500"> {error}</p>
        }
            {/* View All Birthdays Button */}
            <div className="flex justify-end mb-4">
                <button onClick={
                        () => navigate("/birthdays")
                    }
                    className="btn-secondary flex items-center gap-2">
                    <List className="h-4 w-4"/>
                    View All Birthdays
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Total Birthdays</p>
                            <p className="text-2xl font-bold"> {
                                birthdays.length
                            }</p>
                        </div>
                        <Calendar className="h-8 w-8 text-primary-600"/>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Upcoming</p>
                            <p className="text-2xl font-bold"> {
                                upcomingBirthdays.length
                            }</p>
                        </div>
                        <Gift className="h-8 w-8 text-green-600"/>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Today</p>
                            <p className="text-2xl font-bold"> {
                                birthdays.filter((b) => {
                                    const today = new Date();
                                    const birthDate = new Date(b.birthdate);
                                    return(today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate());
                                }).length
                            } </p>
                        </div>
                        <User className="h-8 w-8 text-blue-600"/>
                    </div>
                </div>
            </div>

            {/* Add Birthday Button - Desktop */}
            <div className="hidden lg:flex justify-end mb-6">
                <button onClick={
                        () => {
                            setEditingBirthday(null);
                            setShowModal(true);
                        }
                    }
                    className="bg-primary-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-primary-700 transition-colors">
                    <Plus className="h-5 w-5"/>
                    Add Birthday
                </button>
            </div>

            {/* Birthday List */}
            {
            !loading && !error && (<div className="space-y-4"> {
                upcomingBirthdays.length === 0 ? (<div className="text-center py-12">
                    <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4"/>
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        No upcoming birthdays
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500 mb-6">
                        Add some birthdays to get started!
                    </p>
                    <button onClick={
                            () => {
                                setEditingBirthday(null);
                                setShowModal(true);
                            }
                        }
                        className="bg-primary-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto hover:bg-primary-700 transition-colors">
                        <Plus className="h-5 w-5"/>
                        Add Your First Birthday
                    </button>
                </div>) : (upcomingBirthdays.map((birthday) => (<div key={
                        birthday._id
                    }
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4"> {
                            birthday.imageUrl ? (<img src={
                                    birthday.imageUrl
                                }
                                alt={
                                    birthday.name
                                }
                                className="h-12 w-12 rounded-full object-cover"/>) : (<div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-primary-600"/>
                            </div>)
                        }
                            <div>
                                <h3 className="font-semibold text-lg"> {
                                    birthday.name
                                }</h3>
                                <p className="text-gray-500 dark:text-gray-400"> {
                                    formatDate(birthday.birthdate)
                                }
                                    • {
                                    birthday.relation
                                } </p>
                                {
                                birthday.note && (<p className="text-sm text-gray-600 dark:text-gray-500 mt-1"> {
                                    birthday.note
                                } </p>)
                            } </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400"> {
                                getDaysUntilBirthday(birthday.birthdate)
                            }
                                days
                            </p>
                            <div className="flex gap-2 mt-2">
                                <button onClick={
                                        () => {
                                            setEditingBirthday(birthday);
                                            setShowModal(true);
                                        }
                                    }
                                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                                    <List className="h-4 w-4"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>)))
            } </div>)
        }

            {/* Floating Add Button */}
            <button onClick={
                    () => {
                        setEditingBirthday(null);
                        setShowModal(true);
                    }
                }
                className="lg:hidden fixed bottom-6 right-6 h-14 w-14 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center">
                <Plus className="h-6 w-6"/>
            </button>

            {/* Add/Edit Birthday Modal */}
            {
            showModal && (<BirthdayModal birthday={editingBirthday}
                onSave={handleSaveBirthday}
                onClose={
                    () => {
                        setShowModal(false);
                        setEditingBirthday(null);
                    }
                }/>)
        } </div>
    </>);
};

export default Dashboard;

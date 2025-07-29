import {useState, useEffect} from "react";
import {Plus, Edit2, Trash2, Search} from "lucide-react";
import BirthdayModal from "../components/BirthdayModal";
import {getBirthdays, addBirthday, updateBirthday, deleteBirthday} from "../services/birthdayService.js";

function BirthdayList() {
    const [birthdays, setBirthdays] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingBirthday, setEditingBirthday] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch birthdays from backend
    useEffect(() => {
        fetchBirthdays();
    }, []);

    const fetchBirthdays = async () => {
        try {
            const res = await getBirthdays();
            setBirthdays(res ?. data || []);
        } catch (err) {
            console.error("Failed to fetch birthdays:", err.message);
            setBirthdays([]);
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

    const handleDeleteBirthday = async (id) => {
        if (window.confirm("Are you sure you want to delete this birthday?")) {
            try {
                await deleteBirthday(id);
                fetchBirthdays();
            } catch (err) {
                console.error("Failed to delete birthday:", err.message);
            }
        }
    };

    const handleSaveBirthday = async (birthdayData) => {
        try {
            if (editingBirthday) {
                await updateBirthday(editingBirthday._id, birthdayData);
            } else {
                await addBirthday(birthdayData);
            } fetchBirthdays();
        } catch (err) {
            console.error("Failed to save birthday:", err.message);
        }
        setShowModal(false);
        setEditingBirthday(null);
    };

    const filteredBirthdays = birthdays.filter((b) => b.name ?. toLowerCase().includes(searchTerm.toLowerCase()) || b.note ?. toLowerCase().includes(searchTerm.toLowerCase()));

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

    const birthdaysByMonth = filteredBirthdays.reduce((acc, b) => {
        const month = new Date(b.birthdate).getMonth();
        if (!acc[month]) 
            acc[month] = [];
        
        acc[month].push(b);
        return acc;
    }, {});

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    const getAge = (dateString) => {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (<div className="p-4 lg:p-8 pb-20 lg:pb-8"> {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold">All Birthdays</h1>
                <p className="text-gray-600">
                    Manage all your saved birthdays ({
                    birthdays.length
                }
                    total)
                </p>
            </div>
            <button onClick={handleAddBirthday}
                className="btn-primary mt-4 sm:mt-0 flex items-center gap-2">
                <Plus className="h-4 w-4"/>
                Add Birthday
            </button>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
            <input type="text" placeholder="Search birthdays..."
                value={searchTerm}
                onChange={
                    (e) => setSearchTerm(e.target.value)
                }
                className="input-field pl-10 w-full"/>
        </div>

        {/* Birthday List */}
        {
        Object.keys(birthdaysByMonth).length === 0 ? (<p className="text-center text-gray-500">No birthdays found</p>) : (Object.keys(birthdaysByMonth).sort((a, b) => parseInt(a) - parseInt(b)).map((month) => (<div key={month}
            className="card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4"> {
                monthNames[month]
            }
                ({
                birthdaysByMonth[month].length
            })
            </h2>
            {
            birthdaysByMonth[month].map((birthday) => (<div key={
                    birthday._id
                }
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                <div>
                    <h3 className="font-semibold"> {
                        birthday.name
                    }</h3>
                    <p> {
                        formatDate(birthday.birthdate)
                    }
                        • Age{" "}
                        {
                        getAge(birthday.birthdate)
                    } </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={
                            () => handleEditBirthday(birthday)
                        }
                        className="btn-secondary">
                        <Edit2 className="h-4 w-4"/>
                    </button>
                    <button onClick={
                            () => handleDeleteBirthday(birthday._id)
                        }
                        className="btn-danger">
                        <Trash2 className="h-4 w-4"/>
                    </button>
                </div>
            </div>))
        } </div>)))
    }

        {/* Modal */}
        {
        showModal && (<BirthdayModal birthday={editingBirthday}
            onSave={handleSaveBirthday}
            onClose={
                () => {
                    setShowModal(false);
                    setEditingBirthday(null);
                }
            }/>)
    } </div>);
}

export default BirthdayList;

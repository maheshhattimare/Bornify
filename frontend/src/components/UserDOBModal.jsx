import {useState} from "react";

function UserDOBModal({isOpen, onClose, onSave}) {
    const [dob, setDob] = useState("");

    const handleSave = () => {
        if (!dob) 
            return alert("Please select a date");
        
        onSave(dob);
    };

    if (!isOpen) 
        return null;
     // cleaner than wrapping in isOpen && ...

    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Add Your Date of Birth</h2>
                <input type="date"
                    value={dob}
                    onChange={
                        (e) => setDob(e.target.value)
                    }
                    className="input-field mb-6"/>
                <div className="flex gap-3">
                    <button onClick={handleSave}
                        className="btn-primary flex-1">
                        Save
                    </button>
                    <button onClick={onClose}
                        className="btn-secondary">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>);
}

export default UserDOBModal;

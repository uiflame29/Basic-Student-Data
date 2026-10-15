import { useState } from "react";

function StudentForm({ onAdd }) {
    const [name, setName] = useState("");
    const [grade, setGrade] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (name === "" || grade === "") {
            alert("Please fill in both name and grade");
            return;
        }

        onAdd(name, Number(grade));
        setName("");
        setGrade("");
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <input
                type="text"
                placeholder="Student name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ padding: "8px", marginRight: "8px" }}
            />

            <input
                type="number"
                placeholder="Grade (0-100)"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                style={{ padding: "8px", marginRight: "8px", width: "120px" }}
            />

            <button
                type="submit"
                style={{
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                Add Student
            </button>
        </form>
    );
}

export default StudentForm;
function StudentList({ students, onDelete }) {
    if (students.length === 0) {
        return <p>No students yet. Add one above!</p>;
    }

    return (
        <ul style={{ listStyle: "none", padding: 0 }}>
            {students.map((student) => (
                <li
                    key={student.id}
                    style={{
                        backgroundColor: "white",
                        padding: "12px",
                        marginBottom: "8px",
                        borderRadius: "6px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span>
                        <strong>{student.name}</strong> — Grade: {student.grade}
                    </span>

                    <button
                        onClick={() => onDelete(student.id)}
                        style={{
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default StudentList;
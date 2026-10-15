import { useState } from "react";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import Stats from "./components/Stats";

function App() {
  const [students, setStudents] = useState([]);

  const addStudent = (name, grade) => {
    const newStudent = {
      id: Date.now(),
      name: name,
      grade: grade,
    };
    setStudents([...students, newStudent]);
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h1>📊 Student Analytics</h1>

      <StudentForm onAdd={addStudent} />
      <Stats students={students} />
      <StudentList students={students} onDelete={deleteStudent} />
    </div>
  );
}

export default App;
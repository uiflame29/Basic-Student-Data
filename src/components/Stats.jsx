function Stats({ students }) {
    const total = students.length;

    const grades = students.map((s) => s.grade);
    const average =
        total === 0
            ? 0
            : (grades.reduce((a, b) => a + b, 0) / total).toFixed(1);

    const highest = total === 0 ? 0 : Math.max(...grades);
    const lowest = total === 0 ? 0 : Math.min(...grades);

    return (
        <div
            style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
                flexWrap: "wrap",
            }}
        >
            <StatBox label="Total Students" value={total} />
            <StatBox label="Average" value={average} />
            <StatBox label="Highest" value={highest} />
            <StatBox label="Lowest" value={lowest} />
        </div>
    );
}

function StatBox({ label, value }) {
    return (
        <div
            style={{
                backgroundColor: "white",
                padding: "15px 25px",
                borderRadius: "6px",
                textAlign: "center",
                minWidth: "100px",
            }}
        >
            <div style={{ fontSize: "12px", color: "#666" }}>{label}</div>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>{value}</div>
        </div>
    );
}

export default Stats;
import React,{useState,useEffect} from 'react'
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import { getStudentIssueHistory } from '../utils/issuedApi';


const StudentHistory = () => {
    const [student, setStudent] = useState(null);
    const [issueHistory, setIssueHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { student_id } = useParams();


    useEffect(() => {
        
        const fetchStudentHistory = async () => {
            if (!student_id) {
                toast.error("Student ID is missing");
                return;
            }

            setLoading(true);
            try {
                const response = await getStudentIssueHistory(student_id);
                setIssueHistory(response.data.issued_books);
                setStudent(response.data.student);
            } catch (error) {
                toast.error("Error fetching student history");
            } finally {
                setLoading(false);
            }
        };
        fetchStudentHistory();
    }, [student_id]);

  return (
    <div className="py-5 bg-gray-100" style={{ background: "linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight: "100vh" }}>
        <div className="max-w-7xl mx-auto px-4">

            <div className="flex justify-between items-center mb-4">
                <div>
                    <h4 className="font-medium mb-1">
                        #{student?.student_id} Book Issued History
                    </h4>
                    <p className="text-gray-500 mb-0">
                        {student?.full_name} • {student?.email} • {student?.mobile} • {student?.is_active ? <span className="inline-block bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Active</span> : <span className="inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Inactive</span>}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        className="inline-flex items-center border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                        onClick={() => navigate("/admin/manage-students")}
                    >
                        <i className="fa-solid fa-arrow-left mr-2"></i>
                        Back to Students
                    </button>

                    <button
                        className="inline-flex items-center border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-colors"
                        onClick={() => navigate("/admin/issued-books")}
                    >
                        <i className="fa-solid fa-list mr-2"></i>
                        Issued Books
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded">
                <div className="p-4">

                    <h5 className="font-semibold mb-3">
                        {student?.student_id} Details
                    </h5>

                    {loading ? (
                        <div className="text-center py-4">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                    ) : issueHistory?.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                            No history found
                        </div>
                    ) : (

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-3 py-2 font-medium">#</th>
                                        <th className="px-3 py-2 font-medium">Student ID</th>
                                        <th className="px-3 py-2 font-medium">Student Name</th>
                                        <th className="px-3 py-2 font-medium">Issued Book</th>
                                        <th className="px-3 py-2 font-medium">Issued Date</th>
                                        <th className="px-3 py-2 font-medium">Returned Date</th>
                                        <th className="px-3 py-2 font-medium">Fine (if any)</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {issueHistory?.map?.((item, index) => (
                                        <tr key={item.id} className="border-t align-middle">
                                            <td className="px-3 py-2">{index + 1}</td>
                                            <td className="px-3 py-2">{item.student_id}</td>
                                            <td className="px-3 py-2">{item.student_name}</td>
                                            <td className="px-3 py-2">{item.book_title}</td>

                                            <td className="px-3 py-2">
                                                {item.issued_at
                                                    ? new Date(item.issued_at).toLocaleString()
                                                    : "-"}
                                            </td>

                                            <td className="px-3 py-2">
                                                {item.returned_at
                                                    ? new Date(item.returned_at).toLocaleString()
                                                    : "Not returned yet"}
                                            </td>

                                            <td className="px-3 py-2">
                                                {item.is_returned
                                                    ? item.fine
                                                    : "Not returned yet"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    )}

                </div>
            </div>

        </div>
    </div>
)
}

export default StudentHistory
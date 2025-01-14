import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageLoder from "../components/PageLoder";

const InvestorsTable = () => {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  const [currentInvestor, setCurrentInvestor] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Added search query state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await axios.get(
          "https://backendv3-wmen.onrender.com/api/get-investors"
        );
        const data = Array.isArray(response.data) ? response.data : response.data.investors || [];
        setInvestors(data);
      } catch (error) {
        console.error("Error fetching investors:", error);
        setInvestors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  const handleDelete = (investor) => {
    setCurrentInvestor(investor);
    setConfirmModal(true);
  };

  const deleteInvestor = async () => {
    if (profileName === currentInvestor.name) {
      try {
        await axios.delete(
          `https://backendv3-wmen.onrender.com/api/delete-investor/${currentInvestor._id}`
        );
        setInvestors(investors.filter((inv) => inv._id !== currentInvestor._id));
        alert("Investor deleted successfully!");
      } catch (error) {
        console.error("Error deleting investor:", error);
        alert("Failed to delete investor. Please try again.");
      } finally {
        setConfirmModal(false);
        setCurrentInvestor(null);
        setProfileName("");
      }
    } else {
      alert("Profile name does not match. Deletion cancelled.");
    }
  };

  const handleEdit = (investor) => {
    navigate(`/edit-investor/${investor._id}`);
  };

  const handleViewProfile = (investor) => {
    navigate(`/investor/${investor._id}`);
  };

  const filteredInvestors = investors.filter(
    (investor) =>
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.geography.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.investmentStages.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.investorType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <PageLoder />;
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-gray-100 p-6">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search investors..."
          className="w-full p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
        />
      </div>

      <table className="w-full text-sm text-left text-gray-800 bg-gray-200">
        <thead className="text-xs uppercase bg-gray-300 text-gray-600">
          <tr>
            <th scope="col" className="px-6 py-3">Profile Image</th>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Geography</th>
            <th scope="col" className="px-6 py-3">Investment Stages</th>
            <th scope="col" className="px-6 py-3">Investor Type</th>
            <th scope="col" className="px-6 py-3">Website</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredInvestors) && filteredInvestors.length > 0 ? (
            filteredInvestors.map((investor) => (
              <tr key={investor._id} className="odd:bg-white even:bg-gray-100 border-b">
                <td className="px-6 py-4">
                  <img
                    src={investor.image}
                    alt={`${investor.name}'s Profile`}
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="px-6 py-4 font-medium">
                  <button
                    onClick={() => handleViewProfile(investor)}
                    className="text-blue-600 hover:underline"
                  >
                    {investor.name}
                  </button>
                </td>
                <td className="px-6 py-4">{investor.geography}</td>
                <td className="px-6 py-4">{investor.investmentStages}</td>
                <td className="px-6 py-4">{investor.investorType}</td>
                <td className="px-6 py-4">
                  <a
                    href={investor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit
                  </a>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleEdit(investor)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(investor)}
                    className="font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No investors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {confirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="mb-4 text-lg font-medium">
              Type Profile Name ({currentInvestor.name}) to Confirm Deletion
            </h3>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              placeholder="Profile Name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button onClick={() => setConfirmModal(false)} className="text-gray-600">Cancel</button>
              <button onClick={deleteInvestor} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorsTable;

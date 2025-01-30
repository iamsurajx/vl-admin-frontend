import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../components/PageLoder";
import ConfirmationModal from "./ConfirmationModal"; // Import the modal

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [userToDelete, setUserToDelete] = useState(null); // Store user ID for deletion

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://backendv3-wmen.onrender.com/api/users");
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setUsers(data);
        setFilteredUsers(data); // Initialize filtered users
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = users.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(lowercasedSearch)
      )
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`https://backendv3-wmen.onrender.com/api/users/${userId}`);
      // Update the local state to remove the deleted user
      setUsers(users.filter(user => user._id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const openModal = (userId) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete);
      closeModal();
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center justify-between p-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Profile Picture</th>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Account Type</th>
            <th scope="col" className="px-6 py-3">Verified</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => navigate(`/user/${user.profile?._id}`)}
                >
                  <img
                    src={user.profile?.profilePhoto || "https://via.placeholder.com/50"}
                    alt={`${user.name}'s Profile`}
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {user.name}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {user.isPremium ? "Premium" : "Normal"}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {user.isVerified ? "Verified" : "Not Verified"}
                </td>
                <td className="px-6 py-4 flex items-center">
                  <span
                    className={`w-3 h-3 rounded-full mr-2 ${
                      user.status === "online" ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  {user.status === "online" ? "Online" : "Offline"}
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => openModal(user._id)} 
                    className="font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center px-6 py-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onConfirm={confirmDelete} 
      />
    </div>
  );
};

export default UsersTable;

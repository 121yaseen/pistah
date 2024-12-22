"use client";

import PencilIcon from "@/icons/pencilIcon";
import ProfileIcon from "@/icons/profileIcon";

const PublisherProfilePage: React.FC = () => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-center mb-10">Company Profile</h1>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 shadow-md rounded-lg">
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <label htmlFor="profile-photo"
                className="relative w-32 h-32 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-200
                 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 cursor-pointer 
                 hover:bg-gray-300 dark:hover:bg-gray-700 transition" >
                <ProfileIcon />
                <span
                  className="absolute bottom-1 right-1 w-8 h-8 p-2 border bg-blue-600 border-blue-600 rounded-full text-white transition flex items-center justify-center"
                  style={{ width: "40px", height: "40px", }} >
                  <PencilIcon />
                </span>
              </label>
              <input
                type="file"
                id="profile-photo"
                name="photo"
                accept="image/*"
                className="hidden"
                required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">About Us</label>
              <textarea
                name="description"
                rows={4}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Locations We Serve</label>
              <textarea
                name="locations"
                rows={4}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button type="submit" className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublisherProfilePage;
